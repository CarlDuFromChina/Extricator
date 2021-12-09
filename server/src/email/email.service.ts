import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMTPClient } from 'emailjs';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    this.client = new SMTPClient({
      user: configService.get('EMAIL_USER'),
      password: configService.get('EMAIL_PASSWORD'),
      host: configService.get('EMAIL_HOST'),
      ssl: true,
    });
  }

  private client: SMTPClient;
  
  async send(text: string, to: string, cc: string, subject: string) {
    const message = await this.client.sendAsync({
      text: text,
      from: this.configService.get('EMAIL_USER'),
      to: to,
      cc: cc,
      subject: subject
    } as any);
    return message;
  }
}
