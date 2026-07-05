import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  const corsOrigins = new Set<string>([
    configService.get('FRONTEND_URL', 'http://localhost:3000'),
    configService.get('DASHBOARD_URL', 'http://localhost:3001'),
    'https://alshisr.com',
    'https://www.alshisr.com',
    'https://admin.alshisr.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ]);

  const extraOrigins = configService.get<string>('CORS_ORIGINS', '');
  for (const origin of extraOrigins.split(',')) {
    const trimmed = origin.trim();
    if (trimmed) corsOrigins.add(trimmed);
  }

  app.enableCors({
    origin: [...corsOrigins],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AL SHISR API')
    .setDescription('Luxury E-Commerce Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Products', 'Product management')
    .addTag('Orders', 'Order management')
    .addTag('CMS', 'Content management')
    .addTag('Admin', 'Admin dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('API_PORT', 4000);
  await app.listen(port);
  console.log(`🚀 AL SHISR API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
