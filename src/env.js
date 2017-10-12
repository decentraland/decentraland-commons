
let loaded = false

/**
 * Parses the .env file and adds all variables to the environment
 * Sets the loaded variable to true, ensuring that this method it's called first
 * Read https://github.com/motdotla/dotenv#faq for more info
 * @param {object} [config] - Configuration for .env
 * @param {string} [config.path] - Path to the .env file
 * @param {boolean} [config.override] - Override the current ENV with the value found on the .env file. `config.path` is required if this is true
 */
export function load({ path, override } = {}) {
  const dotenv = require('dotenv')

  if (override) {
    const envConfig = dotenv.parse(require('fs').readFileSync(path))
    Object.assign(process.env, envConfig)
  } else {
    dotenv.config({ path })
  }

  loaded = true
}

export function isDevelopment() {
  return ! isProduction()
}

export function isProduction() {
  return getName() === 'production'
}

export function getName() {
  return getEnv('NODE_ENV')
}

const cache = {}

/**
 * Gets the queried ENV variable by `name`. It will throw if the application didn't call `config` first
 * @param  {string} name - ENV variable name
 * @param  {function|object} fallback - Value to use if `name` is not found. If it's a function, it'll execute it with `name` as argument
 * @return {object} - Result of getting the `name` ENV or fallback
 */
export function getEnv(name, fallback) {
  if (! loaded) throw new Error(`It looks like you're trying to access an ENV variable (${name}) before calling the \`env.config()\` method. Please call it first so the environment can be properly loaded`)

  if (! cache[name]) {
    const value = process.env[name]

    if (value === undefined) {
      if (typeof fallback === 'function') {
        cache[name] = fallback(name)
      } else {
        cache[name] = fallback
      }
      console.log(`Warning: No ${name} environment variable set, defaulting to ${cache[name]}`)

    } else {
      cache[name] = value
    }
  }

  return cache[name]
}
