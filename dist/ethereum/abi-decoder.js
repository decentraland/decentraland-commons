'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Same as https://github.com/ConsenSys/abi-decoder which is not correctly published and can't be minified by webpack as an npm module

var SolidityCoder = require('web3/lib/solidity/coder.js');
var Web3 = require('web3');

var state = {
  savedABIs: [],
  methodIDs: {}
};

function _getABIs() {
  return state.savedABIs;
}

function _addABI(abiArray) {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id's
    abiArray.forEach(function (abi) {
      if (abi.name) {
        var signature = new Web3().sha3(abi.name + '(' + abi.inputs.map(function (input) {
          return input.type;
        }).join(',') + ')');
        if (abi.type === 'event') {
          state.methodIDs[signature.slice(2)] = abi;
        } else {
          state.methodIDs[signature.slice(2, 10)] = abi;
        }
      }
    });

    state.savedABIs = state.savedABIs.concat(abiArray);
  } else {
    throw new Error('Expected ABI array, got ' + (typeof abiArray === 'undefined' ? 'undefined' : _typeof(abiArray)));
  }
}

function _removeABI(abiArray) {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id's
    abiArray.forEach(function (abi) {
      if (abi.name) {
        var signature = new Web3().sha3(abi.name + '(' + abi.inputs.map(function (input) {
          return input.type;
        }).join(',') + ')');
        if (abi.type === 'event') {
          if (state.methodIDs[signature.slice(2)]) {
            delete state.methodIDs[signature.slice(2)];
          }
        } else {
          if (state.methodIDs[signature.slice(2, 10)]) {
            delete state.methodIDs[signature.slice(2, 10)];
          }
        }
      }
    });
  } else {
    throw new Error('Expected ABI array, got ' + (typeof abiArray === 'undefined' ? 'undefined' : _typeof(abiArray)));
  }
}

function _getMethodIDs() {
  return state.methodIDs;
}

function _decodeMethod(data) {
  var methodID = data.slice(2, 10);
  var abiItem = state.methodIDs[methodID];
  if (abiItem) {
    var params = abiItem.inputs.map(function (item) {
      return item.type;
    });
    var decoded = SolidityCoder.decodeParams(params, data.slice(10));
    return {
      name: abiItem.name,
      params: decoded.map(function (param, index) {
        var parsedParam = param;
        if (abiItem.inputs[index].type.indexOf('uint') !== -1) {
          parsedParam = new Web3().toBigNumber(param).toString();
        }
        return {
          name: abiItem.inputs[index].name,
          value: parsedParam,
          type: abiItem.inputs[index].type
        };
      })
    };
  }
}

function padZeros(address) {
  var formatted = address;
  if (address.indexOf('0x') !== -1) {
    formatted = address.slice(2);
  }

  if (formatted.length < 40) {
    while (formatted.length < 40) {
      formatted = '0' + formatted;
    }
  }

  return '0x' + formatted;
}

function _decodeLogs(logs) {
  return logs.map(function (logItem) {
    var methodID = logItem.topics[0].slice(2);
    var method = state.methodIDs[methodID];
    if (!method) return null;

    var logData = logItem.data;
    var decodedParams = [];
    var dataIndex = 0;
    var topicsIndex = 1;

    var dataTypes = [];
    method.inputs.forEach(function (input) {
      if (!input.indexed) {
        dataTypes.push(input.type);
      }
    });
    var decodedData = SolidityCoder.decodeParams(dataTypes, logData.slice(2)
    // Loop topic and data to get the params
    );method.inputs.forEach(function (param) {
      var decodedP = {
        name: param.name,
        type: param.type
      };

      if (param.indexed) {
        decodedP.value = logItem.topics[topicsIndex];
        topicsIndex++;
      } else {
        decodedP.value = decodedData[dataIndex];
        dataIndex++;
      }

      if (param.type === 'address') {
        decodedP.value = padZeros(new Web3().toBigNumber(decodedP.value).toString(16));
      } else if (param.type === 'uint256' || param.type === 'uint8' || param.type === 'int') {
        decodedP.value = new Web3().toBigNumber(decodedP.value).toString(10);
      }

      decodedParams.push(decodedP);
    });

    return {
      name: method.name,
      events: decodedParams,
      address: logItem.address
    };
  }).filter(function (log) {
    return log !== null;
  });
}

module.exports = {
  getABIs: _getABIs,
  addABI: _addABI,
  getMethodIDs: _getMethodIDs,
  decodeMethod: _decodeMethod,
  decodeLogs: _decodeLogs,
  removeABI: _removeABI
};