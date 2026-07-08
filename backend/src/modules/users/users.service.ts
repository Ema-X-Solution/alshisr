import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  AdminUpdateUserDto,
  UserFilterDto,
  AdminCreateUserDto,
} from './users.dto';

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatar: true,
  role: true,
  isActive: true,
  isVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userSelect,
        addresses: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] },
        _count: { select: { orders: true, wishlist: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const { _count, ...rest } = user;
    return {
      ...rest,
      ordersCount: _count.orders,
      wishlistCount: _count.wishlist,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: userSelect,
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new BadRequestException('Password change not available for this account');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: { ...dto, userId, country: dto.country ?? 'OM' },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.ensureAddressOwnership(userId, addressId);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.ensureAddressOwnership(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await this.ensureAddressOwnership(userId, addressId);
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  async findAllUsers(filters: UserFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = getPaginationOffset(page, limit);

    const where = {
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
      ...(filters.search
        ? {
            OR: [
              { email: { contains: filters.search, mode: 'insensitive' as const } },
              { firstName: { contains: filters.search, mode: 'insensitive' as const } },
              { lastName: { contains: filters.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: filters.sortOrder || 'desc' },
        select: {
          ...userSelect,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items.map(({ _count, ...user }) => ({
        ...user,
        ordersCount: _count.orders,
      })),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelect,
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { _count, ...rest } = user;
    return { ...rest, ordersCount: _count.orders, reviewsCount: _count.reviews };
  }

  async adminCreateUser(dto: AdminCreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const password = dto.password
      ? await bcrypt.hash(dto.password, 12)
      : undefined;

    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role ?? Role.CUSTOMER,
        password,
        isVerified: !!password,
      },
      select: userSelect,
    });
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto, currentUserId: string) {
    if (id === currentUserId && dto.isActive === false) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }
    if (id === currentUserId && dto.role && dto.role !== Role.SUPER_ADMIN) {
      const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (currentUser?.role === Role.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot change your own super admin role');
      }
    }

    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: userSelect,
    });
  }

  async adminDeleteUser(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new ForbiddenException('Cannot delete your own account');
    }
    await this.findUserById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  private async ensureAddressOwnership(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }
}
