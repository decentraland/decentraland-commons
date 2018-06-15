import { Env } from './env'

export interface LogLevels {
  trace: boolean
  debug: boolean
  warn: boolean
  log: boolean
  error: boolean
}

/**
 * Log singleton class. A single instance is exported by default from this module
 * Logs objects depending on the environment.
 * The public API consist on calling each log level with the desired log:
 *    log.info('something')
 */
export class Log {
  name: string
  protected logLevels: LogLevels

  /**
   * @param [name=''] - A name prepended to each log
   * @param [logLevels={}] - An object with a Boolean property for each log type which dictates if it's active or not. If left empty, all levels are available
   * @param [logLevels.trace=inDev] - Should you log for the 'trace' level
   * @param [logLevels.debug=inDev] - Should you log for the 'debug' level
   * @param [logLevels.warn=false]  - Should you log for the 'warn' level
   * @param [logLevels.log=false]   - Should you log for the 'log' level
   * @param [logLevels.error=false] - Should you log for the 'error' level
   */
  constructor(name: string = '', logLevels?: LogLevels) {
    this.name = name
    this.logLevels = this.getLogLevels(logLevels)
  }

  debug(...args) {
    this.msg('debug', ...args)
  }

  warn(...args) {
    this.msg('warn', ...args)
  }

  info(...args) {
    this.msg('log', ...args)
  }

  error(...args) {
    this.msg('error', ...args)
  }

  trace(...args) {
    if (this.logLevels.trace) {
      console.trace(...args)
    }
  }

  msg(priority: keyof LogLevels, message?: any, ...extras: any[]) {
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
  }

  getLogLevels(overrides: LogLevels): LogLevels {
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

function consoleOutput(
  priority: string,
  prefix = '',
  message?: any,
  ...extras: any[]
): void {
  if (typeof message === 'function') {
    message = message(...extras)
    extras = []
  }
  console[priority](prefix, message, ...extras)
}
