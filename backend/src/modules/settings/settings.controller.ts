import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get public settings' })
  findPublic() {
    return this.settingsService.findPublicSettings();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings grouped (admin)' })
  findAll() {
    return this.settingsService.findAllGrouped();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update settings (admin)' })
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
