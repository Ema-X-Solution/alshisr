import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { DeleteImageDto } from './upload.dto';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.uploadService.uploadImage(file, folder);
  }

  @Delete('image')
  @ApiOperation({ summary: 'Delete image from Cloudinary' })
  deleteImage(@Body() dto: DeleteImageDto) {
    return this.uploadService.deleteImage(dto.publicId, dto.resourceType);
  }
}
