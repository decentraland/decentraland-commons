import { env } from './env'

// Re-define console.debug which no longer logs (but still exists for some reason) as console.log
console.debug = console.log.bind(console)

function consoleOutput(
  priority: string,
  prefix: string = '',
  message?: string | ((...args) => string),
  ...extras: any[]
) {
  if (typeof message === 'function') {
    message = message(...extras)
    extras = []
  }
  console[priority](prefix, message, ...extras)
}

/**
 * Log singleton class. A single instance is exported by default from this module
 * Logs objects depending on the environment.
 * The public API consist on calling each log level with the desired log:
 *    log.info('something')
 */
export class Log {
  logLevels = null
  outputs = [consoleOutput]
  time = true

  /**
   * @param  {string} [name=''] - A name prepended to each log
   * @param  {object} [shouldLog={}] - An object with a Boolean property for each log type which dictates if it's active or not. If left empty, all levels are available
   */
  constructor(public name = '', public shouldLog = {}) {}

  addOutput(fn) {
    if (!this.outputs.includes(fn)) {
      this.outputs.push(fn)
    }
  }

  removeOutput(fn) {
    this.outputs = this.outputs.filter(e => e !== fn)
  }

  debug(message: string, ...args) {
    return this.msg('debug', message, ...args)
  }

  warn(message: string, ...args) {
    return this.msg('warn', message, ...args)
  }

  info(message: string, ...args) {
    return this.msg('log', message, ...args)
  }

  error(message: string, ...args) {
    return this.msg('error', message, ...args)
  }

  trace(message: string, ...args) {
    if (this.getLogLevels().trace) {
      return console.trace(message, ...args)
    }
  }

  msg(priority: string, message: string, ...extras) {
    const logLevels = this.getLogLevels()

    if (!(priority in logLevels)) {
      throw new Error(`Invalid log message priority: ${priority}`)
    }

    if (this.time) {
      extras.unshift(new Date().toISOString())
    }

    if (logLevels[priority]) {
      for (let output of this.outputs) {
        output(priority, this.name ? `[${this.name}]` : '', message, ...extras)
      }
    }

    return message
  }

  getLogLevels() {
    if (!this.logLevels) {
      const inDev = env.isDevelopment()

      this.logLevels = Object.assign(
        {
          trace: inDev,
          debug: inDev,
          warn: true,
          log: true,
          error: true
        },
        this.shouldLog
      )
    }

    return this.logLevels
  }
}
