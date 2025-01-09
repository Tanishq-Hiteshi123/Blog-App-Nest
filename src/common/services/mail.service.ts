import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class MailService {
  transporter: nodeMailer.Transporter;

  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: `smtp.ethereal.email`,
      port: 587,
      auth: {
        user: 'lilla.terry55@ethereal.email',
        pass: 'yQQSg25MR1QwugbNnN',
      },
    });
  }

  async sendPasswordResetEmail(sendTo: string, resetToken: string) {
    const resetLink = `http://MyApp.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `Auth Backend Service`,
      to: sendTo,
      subject: 'Reset Password Mail',
      html: `<p> your reset Password link : <a href = ${resetLink}> </a> </p>`,
    };

    console.log(mailOptions);
    await this.transporter.sendMail(mailOptions);
  }
}
