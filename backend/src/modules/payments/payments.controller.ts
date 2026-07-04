import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentIntentDto,
  InitiateMyFatoorahDto,
  ConfirmCodDto,
} from './payments.dto';
import { Public, CurrentUser } from '../../common/decorators';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe/intent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  createStripeIntent(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createStripePaymentIntent(userId, dto);
  }

  @Post('myfatoorah/initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate MyFatoorah payment' })
  initiateMyFatoorah(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiateMyFatoorahDto,
  ) {
    return this.paymentsService.initiateMyFatoorah(userId, dto);
  }

  @Post('cod/confirm')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm Cash on Delivery order' })
  confirmCod(@CurrentUser('id') userId: string, @Body() dto: ConfirmCodDto) {
    return this.paymentsService.confirmCod(userId, dto);
  }

  @Public()
  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(
      req.rawBody as Buffer,
      signature,
    );
  }

  @Public()
  @Post('webhooks/myfatoorah')
  @ApiOperation({ summary: 'MyFatoorah webhook handler' })
  myFatoorahWebhook(@Body() body: Record<string, unknown>) {
    return this.paymentsService.handleMyFatoorahWebhook(body);
  }
}
