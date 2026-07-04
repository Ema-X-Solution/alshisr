import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  AdminUpdateUserDto,
  UserFilterDto,
  AdminCreateUserDto,
} from './users.dto';
import { CurrentUser, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'List user addresses' })
  getAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Create address' })
  createAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(userId, dto);
  }

  @Patch('me/addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, id, dto);
  }

  @Delete('me/addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteAddress(userId, id);
  }

  @Patch('me/addresses/:id/default')
  @ApiOperation({ summary: 'Set default address' })
  setDefaultAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.setDefaultAddress(userId, id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get()
  @ApiOperation({ summary: 'List users (admin)' })
  findAllUsers(@Query() filters: UserFilterDto) {
    return this.usersService.findAllUsers(filters);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  findUser(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create user (admin)' })
  adminCreateUser(@Body() dto: AdminCreateUserDto) {
    return this.usersService.adminCreateUser(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update user (admin)' })
  adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.usersService.adminUpdateUser(id, dto, currentUserId);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin)' })
  adminDeleteUser(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    return this.usersService.adminDeleteUser(id, currentUserId);
  }
}
