import * as env from './env'


// Re-define console.debug which no longer does anything (but still exists for some reason) as console.log
console.debug = console.log.bind(console)


/**
 * Log singleton class. A single instance is exported by default from this module
 * Logs objects depending on the environment.
 * The public API consist on calling each log level with the desired log:
 *    log.info('something')
 */
class Log {
  /**
   * @param  {string} name - A name prepended to each log
   * @param  {object} [shouldLog={}] - An object with a Boolean property for each log type
   */
  constructor(name, shouldLog = {}) {
    const inDev  = env.isDevelopment()
    const inProd = env.isProduction()

    this.name = name

    this.shouldLog = Object.assign({
      trace: inDev,
      debug: inDev,
      warn : inDev,
      log  : inDev || inProd,
      error: true
    }, shouldLog)

    this.outputs = [consoleOutput]
  }

  addOutput(fn) {
    if (!this.outputs.includes(fn)) {
      this.outputs.push(fn)
    }
  }

  removeOutput(fn) {
    this.outputs = this.outputs.filter(e => e !== fn)
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
    if (this.shouldLog.trace) {
      return console.trace(...args)
    }
  }

  msg(priority, message, ...extras) {
    if (! (priority in this.shouldLog)) {
      throw new Error(`Invalid log message priority: ${priority}`)
    }

    if (this.time) {
      extras.unshift(new Date().toISOString())
    }

    if (this.name) {
      extras.unshift(this.name)
    }

    if (this.shouldLog[priority]) {
      for (let output of this.outputs) {
        output(priority, message, ...extras)
      }
    }

    return message
  }
}

export Log

export function consoleOutput(priority, message, ...extras) {
  if (typeof message === 'function') {
    message = message(...extras)
    extras = []
  }
  console[priority](message, ...extras)
}

export default new Log()
