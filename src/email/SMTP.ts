import nodemailer from 'nodemailer'

import { Log } from '../log'

const log = new Log('SMTP')

const EMAIL_COOLDOWN = 60 * 1000 // 1 minute = 60 seconds = 60 * 1000 miliseconds

export class SMTP {
  transport

  /**
   * SMTP interface uses `nodemailer` behind the scenes. Check {@link https://github.com/nodemailer/nodemailer} for more info.
   * @param  {string} options.hostname    - Mailer host name
   * @param  {string|number} options.port - String or number representing the port of the mailer
   * @param  {string} [options.username]  - Username to perform auth.
   * @param  {string} [options.password]  - Password to perform auth.
   * @param  {object} [templates={}]      - A mapping of `name` => `func` describing the templates to use. {@link SMPT#setTemplate}
   * @return {STMP}
   */
  constructor({ hostname, port, username, password }, public templates: { [name: string]: Function } = {}) {
    this.transport = this.getTransport(hostname, port, username, password)
  }

  /**
   * Sets a new template to use later.
   * @example <caption>A the template should look like this:</caption>
   * opts => ({
   *   from: `The Decentraland Team <${opts.sender}>`, // sender address
   *   to: opts.email,
   *   subject: "[TEST]",
   *   text: "Thanks, The Decentraland Team",
   *   html: "<p>Thanks,</p><p>The Decentraland Team</p>"
   * })
   * @param {string}   name - Name of the template, to be referenced on {@link SMTP#sendMail}
   * @param {Function} fn   - A function accepting `opts` as an argument, which will be forwarded by {@link SMTP#sendMail}
   */
  setTemplate(name, fn) {
    this.templates[name] = fn
  }

  /**
   * Sends an email using one of the defined templates. If the sending fails, it will retry until it succeeds.
   * @param  {string} email     - Receiver email
   * @param  {string} template  - Name of the template to use, the keys can be found on the `templates` property
   * @param  {object} [opts={}] - Object with properties forwarded to the template
   * @return {Promise<string>}  - A promise which resolved to the send response from the server (after retries, if any)
   */
  sendMail(email, template, opts = {}) {
    if (!email) {
      throw new Error('You need to supply an email to send to')
    }
    if (!this.templates[template]) {
      throw new Error(`Invalid template ${template}`)
    }

    let content = this.templates[template](opts)

    return new Promise(resolve => this._sendMailWithRetry(email, content, resolve))
  }

  // internal
  _sendMailWithRetry(email, opts, callback) {
    this.transport.sendMail(opts, (error, info) => {
      if (error) {
        log.error(`Error sending email to ${email}, retrying in ${EMAIL_COOLDOWN / 1000}seconds`)
        log.error(error, error.stack)

        return setTimeout(() => this._sendMailWithRetry(email, opts, callback), EMAIL_COOLDOWN)
      }
      log.info(`Email ${info.messageId} sent: ${info.response}`)
      callback(info.response)
    })
  }

  /**
   * Creates a nodemailer transport. It uses ENV variables (prefixed with MAIL_) to configure the object
   * @param  {string} hostname    - Mailer host name
   * @param  {string|number} port - String or number representing the port of the mailer
   * @param  {string} [username]  - Username to perform auth.
   * @param  {string} [password]  - Password to perform auth.
   * @return {object} - transport, see @{link https://nodemailer.com/usage/}
   */
  getTransport(hostname: string, port: number | string, username?: string, password?: string) {
    if (typeof port === 'string') {
      port = parseInt(port, 10)
    }

    const options = {
      host: hostname,
      port: port,
      secure: port === 465,
      auth: void 0
    }

    if (username || password) {
      options.auth = {
        user: username,
        pass: password
      }
    }

    this.transport = nodemailer.createTransport(options)

    return this.transport
  }
}
