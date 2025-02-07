import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const appName = process.env.APP_NAME ?? 'App';
  const apiPrefix = 'api';

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
