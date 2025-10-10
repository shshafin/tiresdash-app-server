import nodemailer from "nodemailer";
import config from "../../../config";

export async function sendEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: false,
    auth: {
      user: config.email,
      pass: config.appPass,
    },
  } as any);

  await transporter.sendMail({
    from: config.email, // sender address
    to, // list of receivers
    subject: "Reset Password Link", // Subject line
    html, // html body
  });
}
