/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendActivationMail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  } as unknown as SMTPTransport.Options);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Activate account on forum ${process.env.API_URL || 'http:/localhost:5000'}`,
    text: '',
    html: `
        <div>
          <h1>CONFIRM YOUR ACCAUNT</h1>
          <a href="${link}">CLICK HEAR</a>
        </div>
      `,
  });
};
