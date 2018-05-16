export class Env {
  static isDevelopment() {
    return Env.getName() === 'development'
  }

  static isProduction() {
    return Env.getName() === 'production'
  }

  static isTest() {
    return Env.getName() === 'test'
  }

  static getName() {
    return Env.get('NODE_ENV')
  }

  static get(name, fallback) {
    let value = process.env[name]

    if (value === undefined) {
      if (typeof fallback === 'function') {
        value = fallback(name)
      } else {
        value = fallback
      }
    }

    return value
  }

  constructor() {
    this.loaded = false
  }

  isLoaded() {
    return this.loaded
  }

  load() {}

  isDevelopment() {
    return Env.isDevelopment()
  }

  isProduction() {
    return Env.isProduction()
  }

  isTest() {
    return Env.isTest()
  }

  /**
   * Gets the queried ENV variable by `name`. It will throw if the application didn't call `config` first
   * @param  {string} name - ENV variable name
   * @param  {function|object} [fallback] - Value to use if `name` is not found. If it's a function, it'll execute it with `name` as argument
   * @return {string} - Result of getting the `name` ENV or fallback
   */
  get(name, fallback) {
    if (!this.isLoaded()) {
      this.load()
    }

    return Env.get(name, fallback)
  }

  /**
   * Transform a env string definition into an object
   * @param  {string} envString
   * @return {object} result - Each key represents the name of the var
   */
  parse(envString) {
    const envRegex = /\s*(\S*)=("|')?([^"'\s]*)("|')?\s*/gm
    const env = {}
    let match

    while ((match = envRegex.exec(envString)) !== null) {
      const key = match[1]
      const value = match[3]
      if (key[0] === '#') continue

      env[key] = value.trim()
    }

    return env
  }
}
