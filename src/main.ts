import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

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
