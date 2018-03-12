'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMTP = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _log = require('../log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = new _log.Log('SMTP');

var EMAIL_COOLDOWN = 60 * 1000; // 1 minute = 60 seconds = 60 * 1000 miliseconds

var SMTP = exports.SMTP = function () {
  /**
   * SMTP interface uses `nodemailer` behind the scenes. Check {@link https://github.com/nodemailer/nodemailer} for more info.
   * @param  {string} options.hostname    - Mailer host name
   * @param  {string|number} options.port - String or number representing the port of the mailer
   * @param  {string} [options.username]  - Username to perform auth.
   * @param  {string} [options.password]  - Password to perform auth.
   * @param  {object} [templates={}]      - A mapping of `name` => `func` describing the templates to use. {@link SMPT#setTemplate}
   * @return {STMP}
   */
  function SMTP(_ref) {
    var hostname = _ref.hostname,
        port = _ref.port,
        username = _ref.username,
        password = _ref.password;
    var templates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SMTP);

    this.transport = this.getTransport(hostname, port, username, password);
    this.templates = templates;
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


  _createClass(SMTP, [{
    key: 'setTemplate',
    value: function setTemplate(name, fn) {
      this.templates[name] = fn;
    }

    /**
     * Sends an email using one of the defined templates. If the sending fails, it will retry until it succeeds.
     * @param  {string} email     - Receiver email
     * @param  {string} template  - Name of the template to use, the keys can be found on the `templates` property
     * @param  {object} [opts={}] - Object with properties forwarded to the template
     * @return {Promise<string>}  - A promise which resolved to the send response from the server (after retries, if any)
     */

  }, {
    key: 'sendMail',
    value: function sendMail(email, template) {
      var _this = this;

      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!email) {
        throw new Error('You need to supply an email to send to');
      }
      if (!this.templates[template]) {
        throw new Error('Invalid template ' + template);
      }

      var content = this.templates[template](opts);

      return new Promise(function (resolve) {
        return _this._sendMailWithRetry(email, content, resolve);
      });
    }

    // internal

  }, {
    key: '_sendMailWithRetry',
    value: function _sendMailWithRetry(email, opts, callback) {
      var _this2 = this;

      this.transport.sendMail(opts, function (error, info) {
        if (error) {
          log.error('Error sending email to ' + email + ', retrying in ' + EMAIL_COOLDOWN / 1000 + 'seconds');
          log.error(error, error.stack);

          return setTimeout(function () {
            return _this2._sendMailWithRetry(email, opts, callback);
          }, EMAIL_COOLDOWN);
        }
        log.info('Email ' + info.messageId + ' sent: ' + info.response);
        callback(info.response);
      });
    }

    /**
     * Creates a nodemailer transport. It uses ENV variables (prefixed with MAIL_) to configure the object
     * @param  {string} hostname    - Mailer host name
     * @param  {string|number} port - String or number representing the port of the mailer
     * @param  {string} [username]  - Username to perform auth.
     * @param  {string} [password]  - Password to perform auth.
     * @return {object} - transport, see @{link https://nodemailer.com/usage/}
     */

  }, {
    key: 'getTransport',
    value: function getTransport(hostname, port, username, password) {
      port = parseInt(port, 10);

      var options = {
        host: hostname,
        port: port,
        secure: port === 465
      };

      if (username || password) {
        options.auth = {
          user: username,
          pass: password
        };
      }

      this.transport = _nodemailer2.default.createTransport(options);

      return this.transport;
    }
  }]);

  return SMTP;
}();