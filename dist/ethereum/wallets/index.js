'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WALLET_TYPES = undefined;

var _NodeWallet = require('./NodeWallet');

Object.keys(_NodeWallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _NodeWallet[key];
    }
  });
});

var _LedgerWallet = require('./LedgerWallet');

Object.keys(_LedgerWallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LedgerWallet[key];
    }
  });
});
var WALLET_TYPES = exports.WALLET_TYPES = {
  node: _NodeWallet.NodeWallet.type,
  ledger: _LedgerWallet.LedgerWallet.type
};