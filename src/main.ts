import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from "helmet";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ThrottlerExceptionFilter} from "./filters/throttler-exception.filter";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.set('trust proxy', 'loopback'); //Enabling trust proxy allows you to retrieve the original IP address from the X-Forwarded-For header
    const configService = app.get(ConfigService);


  const port = process.env.PORT ?? 3000;
  const appName = process.env.APP_NAME ?? 'App';
  const apiPrefix = 'api';

  const localServer = process.env.LOCAL_SERVER ?? 'http://localhost:3210';
  const productionServer = process.env.PRODUCTION_SERVER ?? 'https://nn.onrender.com';

  const config = new DocumentBuilder()
    .setTitle('Shrid Kal BDX API')
    .setDescription('This API provides endpoints for managing tasks and other functionalities within the Shrid Kal BDX application.')
    .setVersion('1.0')
    .addServer(localServer, 'Local Development Server')
    .addServer(productionServer, 'Production Server')
    .addTag('App')
    .addTag('Tasks')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT Token',
      in: 'header'
    }, 'JWT-auth')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

    app.use(helmet());  // Apply security middleware to set HTTP headers

    app.enableCors({
        origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',').map(origin => origin.trim()),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 86400,
    });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters(new ThrottlerExceptionFilter(configService));

  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/', 'api/v1']
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(port);

  Logger.log(`${appName} has started successfully and is running on port ${port} and you can run it on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
