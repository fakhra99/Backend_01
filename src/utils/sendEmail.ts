import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  //  Creates an email sending service instance.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // method
  await transporter.sendMail({
    from: `"HR Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};