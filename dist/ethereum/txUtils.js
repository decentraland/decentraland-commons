'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.txUtils = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _log = require('../log');

var _utils = require('../utils');

var _eth = require('./eth');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('txUtils');

/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
var txUtils = exports.txUtils = {
  DUMMY_TX_ID: '0xdeadbeef',

  TRANSACTION_FETCH_DELAY: 10 * 1000,

  TRANSACTION_STATUS: Object.freeze({
    pending: 'pending',
    confirmed: 'confirmed',
    failed: 'failed'
  }),

  /**
   * Waits until the transaction finishes. Returns if it was successfull.
   * Throws if the transaction fails or if it lacks any of the supplied events
   * @param  {string} txId - Transaction id to watch
   * @param  {Array<string>|string} events - Events to watch. See {@link txUtils#getLogEvents}
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  getConfirmedTransaction: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(txId, events) {
      var tx;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return txUtils.waitForCompletion(txId);

            case 2:
              tx = _context.sent;

              if (!this.isFailure(tx)) {
                _context.next = 5;
                break;
              }

              throw new Error('Transaction "' + txId + '" failed');

            case 5:
              if (this.hasLogEvents(tx, events)) {
                _context.next = 7;
                break;
              }

              throw new Error('Missing events for transaction "' + txId + '": ' + events);

            case 7:
              return _context.abrupt('return', tx);

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getConfirmedTransaction(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return getConfirmedTransaction;
  }(),


  /**
   * Wait until a transaction finishes by either being mined or failing
   * @param  {string} txId - Transaction id to watch
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  waitForCompletion: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(txId) {
      var tx;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getTransaction(txId);

            case 2:
              tx = _context2.sent;

              if (!(this.isPending(tx) || !tx.recepeit)) {
                _context2.next = 8;
                break;
              }

              log.debug('"' + txId + '" pending, wait ' + this.TRANSACTION_FETCH_DELAY + 'ms');
              _context2.next = 7;
              return (0, _utils.sleep)(this.TRANSACTION_FETCH_DELAY);

            case 7:
              return _context2.abrupt('return', this.waitForCompletion(txId));

            case 8:

              log.debug('"' + txId + '" completed');
              return _context2.abrupt('return', tx);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function waitForCompletion(_x3) {
      return _ref2.apply(this, arguments);
    }

    return waitForCompletion;
  }(),


  /**
   * Get the transaction status and recepeit
   * @param  {string} txId - Transaction id
   * @return {object} data - Current transaction data. See {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransaction}
   * @return {object.recepeit} transaction - Transaction recepeit
   */
  getTransaction: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(txId) {
      var _ref4, _ref5, tx, recepeit;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Promise.all([_eth.eth.fetchTxStatus(txId), _eth.eth.fetchTxReceipt(txId)]);

            case 2:
              _ref4 = _context3.sent;
              _ref5 = _slicedToArray(_ref4, 2);
              tx = _ref5[0];
              recepeit = _ref5[1];
              return _context3.abrupt('return', _extends({}, tx, { recepeit: recepeit }));

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getTransaction(_x4) {
      return _ref3.apply(this, arguments);
    }

    return getTransaction;
  }(),


  /**
   * Expects the result of getTransaction's geth command and returns true if the transaction is still pending.
   * It'll also check for a pending status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  isPending: function isPending(tx) {
    return tx && (tx.blockNumber === null || tx.status === this.TRANSACTION_STATUS.pending);
  },


  /**
   * Expects the result of getTransactionRecepeit's geth command and returns true if the transaction failed.
   * It'll also check for a failed status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  isFailure: function isFailure(tx) {
    return tx && (!tx.recepeit || tx.recepeit.status === '0x0' || tx.status === this.TRANSACTION_STATUS.failed);
  },


  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} tx - Transaction with a decoded recepeit
   * @param {Array<string>|string} eventNames - A string or array of strings with event names you want to search for
   * @return boolean
   */
  hasLogEvents: function hasLogEvents(tx, eventNames) {
    if (!eventNames || eventNames.length === 0) return true;
    if (!tx.recepit) return false;

    if (!Array.isArray(eventNames)) eventNames = [eventNames];

    return tx.recepeit.filter(function (log) {
      return log && log.name;
    }).every(function (log) {
      return eventNames.includes(log.name);
    });
  }
};