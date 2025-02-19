import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }

  async sendVerificationEmail(email: string, name: string, token: string) {
    try {

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify you Email address',
        template: './verify-email',
        context: {
          name: name,
          verificationLink: verificationLink
        }
      });

    } catch (error) {
      console.log('Error sending email', error);
    }

  }

  async sendResetPasswordEmail(email: string, name: string, token: string) {
    try {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const resetPasswordLink = `${frontendUrl}/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: './reset-password',
        context: {
          email,
          name,
          resetPasswordLink
        }
      });

    } catch (error) {
      console.log('Error sending email', error);
    }
  }

  async sendPasswordFinishReset(email: string, name: string) {
    try {

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: './password-reset-finish',
        context: {
          name,
        }
      });

    } catch (error) {
      console.log('Error sending email', error);
    }
  }

  async sendUpdatePasswordEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Updated',
        template: './update-password',
        context: {
          name: name,
          email: email,
        }
      });

    } catch (error) {
      console.log('Error sending email', error);
    }
  }

  async sendUpdateEmailConfirmation(email: string, name: string, token: string) {
    try {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const updateEmailLink = `${frontendUrl}/update-email?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirm Your New Email Address',
        template: './update-email',
        context: {
          name,
          updateEmailLink
        }
      });

    } catch (error) {
      console.log('Error sending email', error);
    }
  }

}
