import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AnalyticsQueryDto } from './admin.dto';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data' })
  getAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getAnalytics(query.period);
  }
}
