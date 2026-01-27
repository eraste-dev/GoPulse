
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Validation Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('GoPulse API')
    .setDescription('The GoPulse Monitoring API description')
    .setVersion('1.0')
    .addTag('monitoring')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
