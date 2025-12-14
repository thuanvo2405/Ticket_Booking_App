import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Eventify App" <eventify.email@gmail.com>`,
    to: toEmail,
    subject: "Verify your email",
    html: `
      <p>Chào bạn,</p>
      <p>Vui lòng nhấn vào link dưới đây để xác thực email:</p>
      <a href="${verifyUrl}">Xác thực email</a>
      <p>Link chỉ có hiệu lực trong 1 giờ.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordMail = async (toEmail, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Eventify App" <eventify.email@gmail.com>`,
    to: toEmail,
    subject: "Đặt lại mật khẩu cho tài khoản của bạn",
    html: `
      <p>Chào bạn,</p>
      <p>Vui lòng nhấn vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetLink}">Nhấn vào đây để reset password</a>
      <p>Link chỉ có hiệu lực trong 15 phút.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail, sendResetPasswordMail };
