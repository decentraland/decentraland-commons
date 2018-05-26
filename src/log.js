import { Env } from './env'

/**
 * Log singleton class. A single instance is exported by default from this module
 * Logs objects depending on the environment.
 * The public API consist on calling each log level with the desired log:
 *    log.info('something')
 */
export class Log {
  /**
   * @param  {string} [name=''] - A name prepended to each log
   * @param  {object} [logLevels={}] - An object with a Boolean property for each log type which dictates if it's active or not. If left empty, all levels are available
   * @param  {boolean} [logLevels.trace=inDev] - Should you log for the 'trace' level
   * @param  {boolean} [logLevels.debug=inDev] - Should you log for the 'debug' level
   * @param  {boolean} [logLevels.warn=false]  - Should you log for the 'warn' level
   * @param  {boolean} [logLevels.log=false]   - Should you log for the 'log' level
   * @param  {boolean} [logLevels.error=false] - Should you log for the 'error' level

   */
  constructor(name = '', logLevels = {}) {
    this.name = name
    this.logLevels = this.getLogLevels(logLevels)
  }

  debug(...args) {
    return this.msg('debug', ...args)
  }

  warn(...args) {
    return this.msg('warn', ...args)
  }

  info(...args) {
    return this.msg('log', ...args)
  }

  error(...args) {
    return this.msg('error', ...args)
  }

  trace(...args) {
    if (this.logLevels.trace) {
      return console.trace(...args)
    }
  }

  msg(priority, message, ...extras) {
    if (!(priority in this.logLevels)) {
      throw new Error(`Invalid log message priority: ${priority}`)
    }

    if (this.logLevels[priority]) {
      consoleOutput(
        priority,
        this.name ? `[${this.name}]` : '',
        message,
        ...extras
      )
    }

    return message
  }

  getLogLevels(overrides) {
    const inDev = Env.isDevelopment()

    return Object.assign(
      {
        trace: inDev,
        debug: inDev,
        warn: true,
        log: true,
        error: true
      },
      overrides
    )
  }
}

function consoleOutput(priority, prefix = '', message, ...extras) {
  if (typeof message === 'function') {
    message = message(...extras)
    extras = []
  }
  console[priority](prefix, message, ...extras)
}
