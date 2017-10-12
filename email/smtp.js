import nodemailer from 'nodemailer'

import { Log } from './log'
import { getEnv } from './env'


const log = new Log('[SMTP]')

const EMAIL_COOLDOWN = 60 * 1000 // 1 minute = 60 seconds = 60 * 1000 miliseconds

const HOSTNAME = getEnv('MAIL_HOSTNAME')
const SENDER   = getEnv('MAIL_SENDER')
const PORT     = getEnv('MAIL_PORT')
const USERNAME = getEnv('MAIL_USERNAME')
const PASSWORD = getEnv('MAIL_PASS')


const port = parseInt(PORT, 10)
let transporter = nodemailer.createTransport({
  host: HOSTNAME,
  port,
  secure: port === 465,
  auth: {
    user: USERNAME,
    pass: PASSWORD
  }
})

const templates = {
  sample: opts => ({
    from: `The Decentraland Team <${SENDER}>`, // sender address
    to  : opts.email,
    subject: '[TEST]',
    text: 'Thanks, The Decentraland Team',
    html: '<p>Thanks,</p><p>The Decentraland Team</p>'
  })
}

function sendMailWithRetry(email, opts, callback) {
  transporter.sendMail(opts, (error, info) => {
    if (error) {
      log.error(`Error sending email to ${email}, retrying in ${EMAIL_COOLDOWN / 1000}seconds`)
      log.error(error, error.stack)
      return setTimeout(() => sendMailWithRetry(email, opts, callback), EMAIL_COOLDOWN)
    }
    log.info('Email %s sent: %s', info.messageId, info.response)
    callback(info.response)
  })
}

export default {
  templates,

  /**
   * Sets a new template to use later.
   * @param {string}   name - Name of the template, to be referenced on `sendEmail`
   * @param {Function} fn   - A function accepting `opts` as an argument, which will be forwarded by `sendEmail`
   */
  setTemplate(name, fn) {
    this.templates[name] = fn
  },

  /**
   * Sends an email using one of the defined templates. If the sending fails, it will retry until it succeeds.
   * @param  {string} email    - Receiver email
   * @param  {string} template - Name of the template to use, the keys can be found on the `templates` property
   * @param  {object} [opts]   - Object with properties forwarded to the template
   * @return {Promise<string>} - A promise which resolved to the send response from the server (after retries, if any)
   */
  sendMail: (email, template, opts = {}) => {
    if (! email) throw new Error('You need to supply an email to send to')
    if (! templates[template]) throw new Error(`Invalid template ${template}`)

    let content = templates[template](opts)
    return new Promise(resolve => sendMailWithRetry(email, content, resolve))
  }
}
