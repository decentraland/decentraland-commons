"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _env = require("./env");

var env = _interopRequireWildcard(_env);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Re-define console.debug which no longer does anything (but still exists for some reason) as console.log
console.debug = console.log.bind(console);

/**
 * Log singleton class. A single instance is exported by default from this module
 * Logs objects depending on the environment.
 * The public API consist on calling each log level with the desired log:
 *    log.info('something')
 */

var Log = function () {
  /**
   * @param  {string} [name=''] - A name prepended to each log
   * @param  {object} [shouldLog={}] - An object with a Boolean property for each log type which dictates if it's active or not. If left empty, all levels are available
   */
  function Log() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var shouldLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Log);

    this.name = name;
    this.shouldLog = shouldLog;
    this.logLevels = null;
    this.outputs = [consoleOutput];
  }

  _createClass(Log, [{
    key: "addOutput",
    value: function addOutput(fn) {
      if (!this.outputs.includes(fn)) {
        this.outputs.push(fn);
      }
    }
  }, {
    key: "removeOutput",
    value: function removeOutput(fn) {
      this.outputs = this.outputs.filter(function (e) {
        return e !== fn;
      });
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.msg.apply(this, ["debug"].concat(args));
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.msg.apply(this, ["warn"].concat(args));
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.msg.apply(this, ["log"].concat(args));
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.msg.apply(this, ["error"].concat(args));
    }
  }, {
    key: "trace",
    value: function trace() {
      if (this.shouldLog.trace) {
        var _console;

        return (_console = console).trace.apply(_console, arguments);
      }
    }
  }, {
    key: "msg",
    value: function msg(priority, message) {
      var logLevels = this.getLogLevels();

      if (!(priority in logLevels)) {
        throw new Error("Invalid log message priority: " + priority);
      }

      for (var _len5 = arguments.length, extras = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        extras[_key5 - 2] = arguments[_key5];
      }

      if (this.time) {
        extras.unshift(new Date().toISOString());
      }

      if (logLevels[priority]) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.outputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var output = _step.value;

            output.apply(undefined, [priority, this.name, message].concat(extras));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return message;
    }
  }, {
    key: "getLogLevels",
    value: function getLogLevels() {
      if (!this.logLevels) {
        var inDev = env.isDevelopment();

        this.logLevels = Object.assign({
          trace: inDev,
          debug: inDev,
          warn: inDev,
          log: true,
          error: true
        }, this.shouldLog);
      }

      return this.logLevels;
    }
  }]);

  return Log;
}();

function consoleOutput(priority) {
  for (var _len6 = arguments.length, extras = Array(_len6 > 3 ? _len6 - 3 : 0), _key6 = 3; _key6 < _len6; _key6++) {
    extras[_key6 - 3] = arguments[_key6];
  }

  var _console2;

  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var message = arguments[2];

  if (typeof message === "function") {
    message = message.apply(undefined, _toConsumableArray(extras));
    extras = [];
  }
  (_console2 = console)[priority].apply(_console2, [prefix, message].concat(_toConsumableArray(extras)));
}

module.exports = {
  Log: Log,
  log: new Log()
};