"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _log = require("../log");

var _utils = require("../utils");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log("[tx]");

var tx = {
  DUMMY_TX_ID: "0xdeadbeef",

  waitUntilComplete: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(hash) {
      var _this = this;

      var retry, _ref2, tx, recepeit;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              retry = function retry() {
                log.info("Transaction " + hash + " pending, retrying later");
                return (0, _utils.sleep)(1000 * 60).then(function () {
                  return _this.whenComplete(hash);
                });
              };

              _context.next = 3;
              return this.getFull(hash);

            case 3:
              _ref2 = _context.sent;
              tx = _ref2.tx;
              recepeit = _ref2.recepeit;

              if (!(this.isPending(tx) || !recepeit)) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", retry());

            case 8:

              log.info("Transaction " + hash + " completed");
              return _context.abrupt("return", { tx: tx, recepeit: recepeit });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function waitUntilComplete(_x) {
      return _ref.apply(this, arguments);
    }

    return waitUntilComplete;
  }(),
  getFull: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(txId) {
      var _ref4, _ref5, tx, recepeit;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return Promise.all([_index2.default.fetchTxStatus(txId), _index2.default.fetchTxReceipt(txId)]);

            case 2:
              _ref4 = _context2.sent;
              _ref5 = _slicedToArray(_ref4, 2);
              tx = _ref5[0];
              recepeit = _ref5[1];
              return _context2.abrupt("return", { tx: tx, recepeit: recepeit });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getFull(_x2) {
      return _ref3.apply(this, arguments);
    }

    return getFull;
  }(),


  /**
   * Expects the result of getTransaction's geth command
   * and returns true if the transaction is still pending
   * @param {object} tx - The transaction object
   * @return boolean
   */
  isPending: function isPending(tx) {
    if (!tx) return true;
    return tx.blockNumber === null || tx.status === "pending"; // `status` is added by us
  },


  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} logs - The result of decoding the logs of the getTransaction's geth command
   * @param {Array<string>|string} names - A string or array of strings with event names you want to search for
   * @return boolean
   */
  hasLogEvents: function hasLogEvents(logs, names) {
    if (!names || names.length === 0) return false;
    if (!Array.isArray(names)) names = [names];

    logs = logs.filter(function (log) {
      return log && log.name;
    });

    return logs.every(function (log) {
      return names.includes(log.name);
    });
  }
};

module.exports = tx;