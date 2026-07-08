import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import {
  CreatePaymentIntentDto,
  InitiateMyFatoorahDto,
  ConfirmCodDto,
} from './payments.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private notificationsService: NotificationsService,
  ) {
    const stripeKey = this.config.get('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey);
    }
  }

  async createStripePaymentIntent(userId: string, dto: CreatePaymentIntentDto) {
    if (!this.stripe) throw new BadRequestException('Stripe is not configured');

    const order = await this.getOrderForPayment(dto.orderId, userId, PaymentMethod.STRIPE);

    const amountInBaisa = Math.round(Number(order.total) * 1000);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInBaisa,
      currency: 'omr',
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      automatic_payment_methods: { enabled: true },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: Number(order.total),
      currency: 'OMR',
    };
  }

  async initiateMyFatoorah(userId: string, dto: InitiateMyFatoorahDto) {
    const apiKey = this.config.get('MYFATOORAH_API_KEY');
    const baseUrl = this.config.get('MYFATOORAH_BASE_URL', 'https://apitest.myfatoorah.com');
    if (!apiKey) throw new BadRequestException('MyFatoorah is not configured');

    const order = await this.getOrderForPayment(dto.orderId, userId, PaymentMethod.MYFATOORAH);

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const payload = {
      InvoiceValue: Number(order.total),
      CustomerName: `${order.user.firstName} ${order.user.lastName}`,
      CustomerEmail: order.user.email,
      CustomerMobile: order.user.phone || '',
      DisplayCurrencyIso: 'OMR',
      CallBackUrl: dto.callbackUrl || `${frontendUrl}/checkout/callback`,
      ErrorUrl: dto.errorUrl || `${frontendUrl}/checkout/error`,
      Language: 'ar',
      CustomerReference: order.orderNumber,
      UserDefinedField: order.id,
    };

    const response = await fetch(`${baseUrl}/v2/SendPayment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json() as {
      IsSuccess: boolean;
      Message: string;
      Data?: { InvoiceId: number; InvoiceURL: string; PaymentURL: string };
    };

    if (!result.IsSuccess || !result.Data) {
      throw new BadRequestException(result.Message || 'MyFatoorah payment initiation failed');
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentId: String(result.Data.InvoiceId) },
    });

    return {
      invoiceId: result.Data.InvoiceId,
      invoiceUrl: result.Data.InvoiceURL,
      paymentUrl: result.Data.PaymentURL,
    };
  }

  async confirmCod(userId: string, dto: ConfirmCodDto) {
    const order = await this.getOrderForPayment(dto.orderId, userId, PaymentMethod.COD);

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PROCESSING,
        },
      });

      await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          status: OrderStatus.PROCESSING,
          note: 'COD order confirmed',
        },
      });

      return result;
    });

    await this.notificationsService.create({
      userId: order.userId,
      title: 'Order Confirmed',
      titleAr: 'تم تأكيد الطلب',
      message: `Your order ${order.orderNumber} has been confirmed.`,
      messageAr: `تم تأكيد طلبك ${order.orderNumber}.`,
      type: 'order',
      link: `/orders/${order.id}`,
    });

    return {
      message: 'COD order confirmed',
      order: {
        id: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
        paymentStatus: updated.paymentStatus,
      },
    };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe) throw new BadRequestException('Stripe is not configured');

    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new BadRequestException('Stripe webhook secret not configured');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.markOrderPaid(paymentIntent.metadata.orderId, paymentIntent.id);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.markOrderFailed(paymentIntent.metadata.orderId);
    }

    return { received: true };
  }

  async handleMyFatoorahWebhook(body: Record<string, unknown>) {
    const invoiceId = body.InvoiceId ?? body.invoiceId;
    const transactionStatus = body.TransactionStatus ?? body.transactionStatus;

    if (!invoiceId) {
      throw new BadRequestException('Invalid webhook payload');
    }

    const order = await this.prisma.order.findFirst({
      where: { paymentId: String(invoiceId) },
    });

    if (!order) return { received: true };

    const status = String(transactionStatus).toLowerCase();
    if (status === 'succss' || status === 'success' || status === 'paid') {
      await this.markOrderPaid(order.id, String(invoiceId));
    } else if (status === 'failed') {
      await this.markOrderFailed(order.id);
    }

    return { received: true };
  }

  private async getOrderForPayment(
    orderId: string,
    userId: string,
    expectedMethod: PaymentMethod,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');
    if (order.paymentMethod !== expectedMethod) {
      throw new BadRequestException(`Order payment method is ${order.paymentMethod}`);
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is cancelled');
    }

    return order;
  }

  private async markOrderPaid(orderId: string, paymentId: string) {
    if (!orderId) return;

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.paymentStatus === PaymentStatus.PAID) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paymentId,
          status: OrderStatus.PROCESSING,
        },
      });

      await tx.orderTimeline.create({
        data: {
          orderId,
          status: OrderStatus.PROCESSING,
          note: 'Payment received',
        },
      });
    });

    await this.notificationsService.create({
      userId: order.userId,
      title: 'Payment Successful',
      titleAr: 'تم الدفع بنجاح',
      message: `Payment for order ${order.orderNumber} was successful.`,
      messageAr: `تم الدفع للطلب ${order.orderNumber} بنجاح.`,
      type: 'payment',
      link: `/orders/${order.id}`,
    });
  }

  private async markOrderFailed(orderId: string) {
    if (!orderId) return;

    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
  }
}
