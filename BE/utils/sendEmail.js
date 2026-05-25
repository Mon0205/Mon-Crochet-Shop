import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
  const requiredMailConfig = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'MAIL_FROM']
  const missingMailConfig = requiredMailConfig.filter((key) => !process.env[key])

  if (missingMailConfig.length) {
    throw new Error(`Missing mail configuration: ${missingMailConfig.join(', ')}`)
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  })
}
