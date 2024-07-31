import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'

export const mailersend = new MailerSend({
  apiKey: process.env.MAILSEND_API_TOKEN || '',
})

export const sender = new Sender(
  process.env.MAILSEND_USERNAME || '',
  'Stocktrack'
)

export const sendMail = async (
  email: string,
  name: string,
  user_id: number
) => {
  const recipients = [new Recipient(email, name)]
  const variables = [
    {
      email,
      substitutions: [
        {
          var: 'user_id',
          value: user_id.toString(),
        },
      ],
    },
  ]
  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setReplyTo(sender)
    .setSubject('Welcome to Stocktrack')
    .setVariables(variables)
    .setTemplateId(process.env.MAILSEND_EMAIL_VERIFICATION_TEMPLATE_ID || '')

  await mailersend.email.send(emailParams)
}
