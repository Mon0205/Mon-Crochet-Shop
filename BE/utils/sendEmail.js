import sgMail from '@sendgrid/mail'

export const sendEmail = async ({ to, subject, text, html }) => {
  const requiredMailConfig = ['SENDGRID_API_KEY', 'MAIL_FROM']
  const missingMailConfig = requiredMailConfig.filter((key) => !process.env[key])

  if (missingMailConfig.length) {
    throw new Error(`Missing mail configuration: ${missingMailConfig.join(', ')}`)
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  try {
    const [response] = await sgMail.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false,
        },
        openTracking: {
          enable: false,
        },
      },
    })
    console.log('SENDGRID ACCEPTED:', {
      statusCode: response.statusCode,
      messageId: response.headers['x-message-id'],
    })
  } catch (error) {
    const sendGridError = error.response?.body?.errors?.[0]?.message || error.message
    console.error('SENDGRID ERROR:', error.response?.body || error.message)
    throw new Error(sendGridError || 'SendGrid email failed')
  }
}
