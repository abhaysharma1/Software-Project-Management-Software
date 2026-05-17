import nodemailer from "nodemailer"

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const emailFrom = process.env.EMAIL_FROM || "noreply@spms.app"

function createTransporter() {
  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })
  }

  const ethereal = nodemailer.createTestAccount()
  return ethereal.then((account) => {
    console.log("📧 Using Ethereal test email account:", account.user)
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    })
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`

  const transporter = await createTransporter()

  const info = await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "SPMS - Password Reset Request",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>You requested a password reset for your SPMS account.</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">SPMS - Software Project Management System</p>
      </div>
    `,
  })

  if (!smtpHost) {
    console.log("📧 Password reset preview URL:", nodemailer.getTestMessageUrl(info))
  }

  return info
}
