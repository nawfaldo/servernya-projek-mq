import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'teresa40@ethereal.email',
      pass: 'QnU6S8hHRgYTkEGTm6',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: to,
    subject: 'Change password',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
