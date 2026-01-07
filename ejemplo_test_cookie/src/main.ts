import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DisableOptionsInterceptor } from './security/disable-options/disable-options.interceptor';
import { SetSecurityHeadersInterceptor } from './security/set-security-headers/set-security-headers.interceptor';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environment = process.env.ENVIRONMENT ?? 'local';
  //swagger

  const config = new DocumentBuilder()
  .setTitle('API Documentación')
  .setDescription('API creada de ejemplo')
  .setVersion('1.0.0')
  .addTag("Category")
  .addTag("Health")
  .build();
  let document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion', app, document);
  //CORS
  app.enableCors();

  const port = process.env.BFF_API_PORT;
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // ✅ Habilita el parsing del body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Registrar el interceptor globalmente
  app.useGlobalInterceptors(new DisableOptionsInterceptor());
  app.useGlobalInterceptors(new SetSecurityHeadersInterceptor());
  await app.listen(port ?? 3000);

  const host = environment === 'local' ? `http://localhost:${port}` : '';

  Logger.log(
    `🚀 ${process.env.PRODUCT_NAME} iniciado` +
    (host ? ` en: ${host}` : '') +
    ` | 🕒 Hora: ${new Date().toLocaleString('es-CL')}` +
    ` | 🔧 Entorno: ${environment}`,
    'Bootstrap',
  );
}
bootstrap();
