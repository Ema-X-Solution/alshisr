import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './shipping.dto';
import { Public } from '../../common/decorators';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Public()
  @Get('zones')
  @ApiOperation({ summary: 'Get shipping zones and rates' })
  findZones() {
    return this.shippingService.findZones();
  }

  @Public()
  @Post('calculate')
  @ApiOperation({ summary: 'Calculate shipping cost' })
  calculate(@Body() dto: CalculateShippingDto) {
    return this.shippingService.calculateShipping(dto);
  }
}
