import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL =
  process.env.FROM_EMAIL || "no-reply@online-grocery-web-app.com";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export async function sendVerificationEmail(
  toEmail: string,
  token: string,
): Promise<void> {
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Online Grocery Web App" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Verifikasi Email - Online Grocery Web App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Verifikasi Email Anda</h2>
        <p>Halo,</p>
        <p>Terima kasih telah mendaftar di Online Grocery Web App.</p>
        <p>Silakan klik tombol di bawah ini untuk memverifikasi email dan menyelesaikan pendaftaran akun Anda:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Verifikasi Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Atau salin tautan berikut ke browser Anda:<br>
          <a href="${verificationLink}">${verificationLink}</a>
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Tautan ini akan kadaluarsa dalam 1 jam.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          Jika Anda tidak mendaftar akun ini, abaikan email ini.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(
  toEmail: string,
  token: string,
): Promise<void> {
  const resetLink = `${FRONTEND_URL}/confirm-reset-password?token=${token}`;

  const mailOptions = {
    from: `"Online Grocery Web App" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Reset Password - Online Grocery Web App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reset Password</h2>
        <p>Halo,</p>
        <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
        <p>Silakan klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}"
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Atau salin tautan berikut ke browser Anda:<br>
          <a href="${resetLink}">${resetLink}</a>
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Tautan ini akan kadaluarsa dalam 1 jam.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          Jika Anda tidak meminta reset password, abaikan email ini.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}