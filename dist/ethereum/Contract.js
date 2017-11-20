'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abiDecoder = require('./abi-decoder');

var _abiDecoder2 = _interopRequireDefault(_abiDecoder);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class to work with Ethereum contracts */
var Contract = function () {
  _createClass(Contract, null, [{
    key: 'getInstance',

    /**
     * Get a singleton instance of the current contract. Intended to be overriden
     * @return {Contract<instance>} - instance
     */
    value: function getInstance() {
      throw new Error('You should override this method on each Contract subclass');
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
     * See {@link Contract#decodeMethod}
     */

  }, {
    key: 'decodeMethod',
    value: function decodeMethod(input) {
      return _abiDecoder2.default.decodeMethod(input);
    }

    /**
     * See {@link Contract#decodeLogs}
     */

  }, {
    key: 'decodeLogs',
    value: function decodeLogs(logs) {
      return _abiDecoder2.default.decodeLogs(logs);
    }

    /**
     * @param  {string} name    - Name of the contract, just as a reference
     * @param  {string} address - Address of the contract
     * @param  {object} abi     - Object describing the contract (build result)
     * @return {Contract} instance
     */

  }]);

  function Contract(name, address, abi) {
    _classCallCheck(this, Contract);

    this.name = name;
    this.address = address;
    this.setAbi(abi);

    this.instance = null;
  }

  _createClass(Contract, [{
    key: 'setAbi',
    value: function setAbi(abi) {
      if (!abi) {
        throw new Error('Tried to instantiate a Contract without an `abi`');
      }

      this.abi = abi;
      _abiDecoder2.default.addABI(abi);
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

    /**
     * Gets a transaction result `input` and returns a parsed object with the method execution details.
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} input - Hex input
     * @return {object} - Object representing the method execution
     */

  }, {
    key: 'decodeMethod',
    value: function decodeMethod(input) {
      return Contract.decodeMethod(input);
    }

    /**
     * Gets a transaction recepeit `logs` and returns a parsed array with the details
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} logs - Hex logs
     * @return {array<object>} - An array of logs triggered by the transaction
     */

  }, {
    key: 'decodeLogs',
    value: function decodeLogs(logs) {
      return Contract.decodeLogs(logs);
    }

    /**
     * Tries to find the supplied parameter to a *decoded* method [decodedMethod]{@link Contract#decodedMethod}. It returns the Wei value
     * A method typicaly consist of { "name": "methodName", "params": [{ "name": "paramName", "value": "VALUE_IN_WEI", "type": "uint256" }] }
     * @param  {object} decodedMethod
     * @param  {string} paramName
     * @return {string} - Found result or undefined
     */

  }, {
    key: 'findParamValue',
    value: function findParamValue(decodedMethod, paramName) {
      var params = decodedMethod.params || [];
      var param = params.find(function (param) {
        return param.name === paramName;
      });

      if (param) {
        return param.value;
      }
    }
  }]);

  return Contract;
}();

module.exports = Contract;