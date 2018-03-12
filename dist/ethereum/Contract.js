'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contract = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _abi = require('./abi');

var _Event = require('./Event');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class to work with Ethereum contracts */
var Contract = exports.Contract = function () {
  _createClass(Contract, null, [{
    key: 'getContractName',

    /**
     * Get the contract name
     * @return {string} - contract name
     */
    value: function getContractName() {
      throw new Error('Not implemented, please override `getContractName`');
    }

    /**
     * Get the default address used for this contract. You should override it on subclasses
     * @return {string} - address
     */

  }, {
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      throw new Error('Not implemented, please override `getDefaultAddress`');
    }

    /**
     * Get the default abi used for this contract. You should override it on subclasses
     * @return {object} - abi
     */

  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      throw new Error('Not implemented, please override `getDefaultAbi`');
    }

    /**
     * Get the contract events from the abi
     * @return {Array<string>} - events
     */

  }, {
    key: 'getEvents',
    value: function getEvents() {
      return new _abi.Abi(this.getDefaultAbi()).getEvents();
    }

    /**
     * Checks if an address is actually 0 in hex or a falsy value
     * @param  {string} address
     * @return {boolean}
     */

  }, {
    key: 'isEmptyAddress',
    value: function isEmptyAddress(address) {
      return !address || address === '0x0000000000000000000000000000000000000000';
    }

    /**
     * See {@link Contract#transaction}
     */

  }, {
    key: 'transaction',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(method) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _utils.promisify)(method).apply(undefined, _toConsumableArray(args));

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function transaction(_x) {
        return _ref.apply(this, arguments);
      }

      return transaction;
    }()

    /**
     * See {@link Contract#call}
     */

  }, {
    key: 'call',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(prop) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _utils.promisify)(prop.call).apply(undefined, _toConsumableArray(args));

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function call(_x2) {
        return _ref2.apply(this, arguments);
      }

      return call;
    }()

    /**
     * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
     * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
     * @return {Contract} instance
     */

  }]);

  function Contract(address, abi) {
    _classCallCheck(this, Contract);

    this.setAddress(address || this.constructor.getDefaultAddress());
    this.setAbi(abi || this.constructor.getDefaultAbi());
    this.instance = null;

    this.abi.extend(this);
  }

  /**
   * Set's the address of the contract. It'll throw on falsy values
   * @param {string} address - Address of the contract
   */


  _createClass(Contract, [{
    key: 'setAddress',
    value: function setAddress(address) {
      if (!address) {
        throw new Error('Tried to instantiate a Contract without an `address`');
      }

      this.address = address;
    }

    /**
     * Set's the abi of the contract. It'll throw on falsy values
     * @param {object} abi - Abi of the contract
     */

  }, {
    key: 'setAbi',
    value: function setAbi(abi) {
      if (!abi) {
        throw new Error('Tried to instantiate a Contract without an `abi`');
      }

      this.abi = _abi.Abi.new(abi);
    }
  }, {
    key: 'setInstance',
    value: function setInstance(instance) {
      this.instance = instance;
    }

    /**
     * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
     * @param  {string}    method - Method name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the transaction method, in order
     * @return {Promise} - promise that resolves when the transaction does
     */

  }, {
    key: 'transaction',
    value: function transaction(method) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return Contract.transaction.apply(Contract, [this.instance[method]].concat(args));
    }

    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {string}    prop - Prop name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */

  }, {
    key: 'call',
    value: function call(prop) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return Contract.call.apply(Contract, [this.instance[prop]].concat(args));
    }
  }, {
    key: 'getEvent',
    value: function getEvent(eventName) {
      return new _Event.Event(this, eventName);
    }
  }]);

  return Contract;
}();