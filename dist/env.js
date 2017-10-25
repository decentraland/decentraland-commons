"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.isDevelopment = isDevelopment;
exports.isProduction = isProduction;
exports.getName = getName;
exports.getEnv = getEnv;

var _utils = require("./utils");

var loaded = false;

/**
 * Parses the .env file and adds all variables to the environment
 * Sets the loaded variable to true, ensuring that this method it's called first
 * Read https://github.com/motdotla/dotenv#faq for more info
 * @param {object} [config] - Configuration for .env
 * @param {string} [config.path] - Path to the .env file
 * @param {boolean} [config.override] - Override the current ENV with the value found on the .env file. `config.path` is required if this is true
 */
function load() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      path = _ref.path,
      override = _ref.override;

  if (loaded) return;

  var dotenv = require("dotenv");

  if (override) {
    var envConfig = dotenv.parse(require("fs").readFileSync(path));
    Object.assign(process.env, envConfig);
  } else {
    dotenv.config({ path: path });
  }

  loaded = true;
}

function isDevelopment() {
  return !isProduction();
}

function isProduction() {
  return getName() === "production";
}

function getName() {
  return getEnv("NODE_ENV");
}

var cache = {};

/**
 * Gets the queried ENV variable by `name`. It will throw if the application didn't call `config` first
 * @param  {string} name - ENV variable name
 * @param  {function|object} [fallback] - Value to use if `name` is not found. If it's a function, it'll execute it with `name` as argument
 * @return {object} - Result of getting the `name` ENV or fallback
 */
function getEnv(name, fallback) {
  if (!loaded && (0, _utils.isEmptyObject)(cache)) {
    console.log("It looks like you're trying to access an ENV variable (" + name + ") before calling the `env.load()` method. Please call it first so the environment can be properly loaded from the .env file. We'll try to get the variables out of process.env anyway");
  }

  if (!cache[name]) {
    var value = process.env[name];

    if (value === undefined) {
      if (typeof fallback === "function") {
        cache[name] = fallback(name);
      } else {
        cache[name] = fallback;
      }

      if (!cache.hasOwnProperty(name)) {
        console.log("Warning: No " + name + " environment variable set, defaulting to " + cache[name]);
      }
    } else {
      cache[name] = value;
    }
  }

  return cache[name];
}