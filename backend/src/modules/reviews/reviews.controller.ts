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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, ReviewFilterDto } from './reviews.dto';
import { Public, CurrentUser, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'List approved reviews for a product' })
  findByProduct(
    @Param('productId') productId: string,
    @Query() filters: ReviewFilterDto,
  ) {
    return this.reviewsService.findByProduct(productId, filters);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product review' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('pending')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending reviews (admin)' })
  findPending(@Query() filters: ReviewFilterDto) {
    return this.reviewsService.findPending(filters);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve review (admin)' })
  approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }
}
