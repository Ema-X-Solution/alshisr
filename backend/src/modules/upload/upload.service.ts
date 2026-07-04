import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'alshisr',
  ): Promise<{ url: string; publicId: string; width: number; height: number }> {
    if (!file) throw new BadRequestException('No file provided');

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(new BadRequestException(error?.message || 'Upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string, resourceType = 'image') {
    if (!publicId) throw new BadRequestException('Public ID is required');

    const id = publicId.includes('cloudinary.com')
      ? this.extractPublicId(publicId)
      : publicId;

    const result = await cloudinary.uploader.destroy(id, {
      resource_type: resourceType,
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException('Failed to delete image');
    }

    return { message: 'Image deleted successfully', publicId: id };
  }

  private extractPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : url;
  }
}
