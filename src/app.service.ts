import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const appName = process.env.APP_NAME ?? 'App';
    const welcomeMessage = `Welcome to ${appName}! We're glad to have you here.`;
    return welcomeMessage;
  }
}
