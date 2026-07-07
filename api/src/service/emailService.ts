import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  await transporter.sendMail({
    from: `"Finpro" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Finpro Email Verification",
    html: `
      <h2>Verify your Finpro account</h2>
      <p>Your verification code/token is:</p>
      <h3>${token}</h3>
      <p>Open Finpro, click Verify Email, then paste this code and set your password.</p>
    `,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  await transporter.sendMail({
    from: `"Finpro" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Finpro Reset Password",
    html: `
      <h2>Reset your Finpro password</h2>
      <p>Your reset token is:</p>
      <h3>${token}</h3>
      <p>Open Finpro, click Forgot Password, then paste this token and set new password.</p>
    `,
  });
}