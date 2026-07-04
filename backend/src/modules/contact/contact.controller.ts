import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { SubmitContactDto, ContactFilterDto } from './contact.dto';
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  submit(@Body() dto: SubmitContactDto) {
    return this.contactService.submit(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List contact messages (admin)' })
  findAll(@Query() filters: ContactFilterDto) {
    return this.contactService.findAll(filters);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark message as read (admin)' })
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
