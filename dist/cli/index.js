"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runProgram = runProgram;

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Runs a set of different clients. Useful to split functionalities and lower boilerplate code
 * @param {array} clients - An array of objects that implement the `addCommand method`
 */
function runProgram(clients) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var client = _step.value;

      if (typeof client.addCommands !== "function") {
        throw new Error("Each client supplied to `runProgram` must implement the `addCommands` function");
      }

      client.addCommands(_commander2.default);
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

  if (!process.argv.slice(2).length) {
    _commander2.default.outputHelp();
    process.exit();
  }

  _commander2.default.parse(process.argv);
}

/**
 * Query the user for a boolean result
 * @param {string} [text=Are you sure?]  - The text to show to the user
 * @param {boolean} [defaultAnswer=true] - The value for the default answer
 */

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Are you sure?";
    var defaultAnswer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _inquirer2.default.prompt({
              type: "confirm",
              name: "confirm",
              message: text,
              default: defaultAnswer
            });

          case 2:
            res = _context.sent;
            return _context.abrupt("return", res.confirm);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function confirm() {
    return _ref.apply(this, arguments);
  }

  return confirm;
}();