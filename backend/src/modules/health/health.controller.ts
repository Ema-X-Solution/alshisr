import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return this.healthService.check();
  }
}
