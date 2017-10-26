import { isEmptyObject } from "./utils";

/**
 * Flag which determines if the ENV variables are already loaded
 * It's no necessary if we're on the browser so it'll default as true.
 * You can use a pre-build plugin to load your variables, like {@link https://www.npmjs.com/package/webpack-dotenv-plugin}
 * @type {boolean}
 */
let loaded = process.browser;

const cache = {};

/**
 * ENV management
 * @namespace
 */
const env = {
  /**
   * Sets the `loaded` variable to true enabling the rest of the ENV variables to be accessed.
   * If we're on a node environment ensure that this method it's called first, as it parses the .env file and adds all variables to the environment.
   * See {@link https://github.com/motdotla/dotenv#faq} for more info on dotenv.
   * @param {object} [config] - Configuration for .env
   * @param {string} [config.path] - Path to the .env file
   * @param {boolean} [config.override] - Override the current ENV with the value found on the .env file. `config.path` is required if this is true
   */
  load({ path, override } = {}) {
    if (loaded) return;

    const dotenv = require("dotenv");

    if (override) {
      const envConfig = dotenv.parse(require("fs").readFileSync(path));
      Object.assign(process.env, envConfig);
    } else {
      dotenv.config({ path });
    }

    loaded = true;
  },

  isDevelopment() {
    return !this.isProduction();
  },

  isProduction() {
    return this.getName() === "production";
  },

  getName() {
    return this.get("NODE_ENV");
  },

  /**
   * Gets the queried ENV variable by `name`. It will throw if the application didn't call `config` first
   * @param  {string} name - ENV variable name
   * @param  {function|object} [fallback] - Value to use if `name` is not found. If it's a function, it'll execute it with `name` as argument
   * @return {object} - Result of getting the `name` ENV or fallback
   */
  get(name, fallback) {
    if (!loaded && isEmptyObject(cache)) {
      console.log(
        `It looks like you're trying to access an ENV variable (${name}) before calling the \`env.load()\` method. Please call it first so the environment can be properly loaded from the .env file. We'll try to get the variables out of process.env anyway`
      );
    }

    if (!cache[name]) {
      const value = process.env[name];

      if (value === undefined) {
        if (typeof fallback === "function") {
          cache[name] = fallback(name);
        } else {
          cache[name] = fallback;
        }

        if (!cache.hasOwnProperty(name)) {
          console.log(
            `Warning: No ${name} environment variable set, defaulting to ${cache[
              name
            ]}`
          );
        }
      } else {
        cache[name] = value;
      }
    }

    return cache[name];
  }
};

module.exports = env;
