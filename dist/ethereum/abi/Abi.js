'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Abi = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _abiDecoder = require('./abi-decoder');

var abi = {
  extend: function extend(contract) {
    var call = function call(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return contract.call.apply(contract, [name].concat(args));
    };
    var transaction = function transaction(name) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return contract.transaction.apply(contract, [name].concat(args));
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var method = _step.value;
        var name = method.name,
            stateMutability = method.stateMutability,
            type = method.type;


        if (typeof contract[name] !== 'undefined') continue;

        switch (type) {
          case 'function':
            {
              if (stateMutability === 'view') {
                contract[name] = call.bind(null, name);
              } else if (stateMutability === 'nonpayable') {
                contract[name] = transaction.bind(null, name);
              }
              break;
            }
          default:
            break;
        }
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
  },


  /**
   * Get the contract events
   * @return {Array<string>} - events
   */
  getEvents: function getEvents() {
    return this.filter(function (method) {
      return method.type === 'event';
    }).map(function (event) {
      return event.name;
    });
  },


  /**
   * Gets a transaction result `input` and returns a parsed object with the method execution details.
   * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
   * @param  {string} input - Hex input
   * @return {object} - Object representing the method execution
   */
  decodeMethod: function decodeMethod(input) {
    return _abiDecoder.abiDecoder.decodeMethod(input);
  },


  /**
   * Gets a transaction recepeit `logs` and returns a parsed array with the details
   * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
   * @param  {string} logs - Hex logs
   * @return {array<object>} - An array of logs triggered by the transaction
   */
  decodeLogs: function decodeLogs(logs) {
    return _abiDecoder.abiDecoder.decodeLogs(logs);
  },


  /**
   * Tries to find the supplied parameter to a *decoded* method {@link abi#decodeMethod}. It returns the Wei value
   * A method typicaly consist of { "name": "methodName", "params": [{ "name": "paramName", "value": "VALUE_IN_WEI", "type": "uint256" }] }
   * @param  {object} decodedMethod
   * @param  {string} paramName
   * @return {string} - Found result or undefined
   */
  findParamValue: function findParamValue(decodedMethod, paramName) {
    var params = decodedMethod.params || [];
    var param = params.find(function (param) {
      return param.name === paramName;
    });

    if (param) {
      return param.value;
    }
  }
};

var Abi = exports.Abi = _extends({
  new: function _new(abiObject) {
    var newAbi = Object.create(abiObject);
    _abiDecoder.abiDecoder.addABI(abiObject);
    return Object.assign(newAbi, abi);
  }
}, abi);