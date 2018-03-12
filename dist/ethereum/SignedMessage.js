'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignedMessage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eth = require('./eth');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Work with signatures made with Ethereum wallets
 */
var SignedMessage = exports.SignedMessage = function () {
  function SignedMessage(message, signature) {
    _classCallCheck(this, SignedMessage);

    if (!message || !signature) {
      throw new Error('You need to supply a message and a signature');
    }

    this.message = message;
    this.signature = signature;
  }

  /**
   * Decodes the message for the given signature
   * @return {string} address - Address which signed the message
   */


  _createClass(SignedMessage, [{
    key: 'getAddress',
    value: function getAddress() {
      var decodedMessage = this.decodeMessage();

      var _decodeSignature = this.decodeSignature(),
          v = _decodeSignature.v,
          r = _decodeSignature.r,
          s = _decodeSignature.s;

      var pubkey = _eth.eth.utils.ecrecover(_eth.eth.utils.hashPersonalMessage(decodedMessage), v, r, s);

      return '0x' + _eth.eth.utils.pubToAddressHex(pubkey);
    }

    /**
     * Decodes the signed message so it's ready to be stringified
     * @return {Buffer} - Buffer containing the decoded message
     */

  }, {
    key: 'decodeMessage',
    value: function decodeMessage() {
      return new Buffer(this.message.substr(2), 'hex');
    }

    /**
     * Decodes the signature of a message
     * @return {Buffer} - Buffer containing the decoded signature
     */

  }, {
    key: 'decodeSignature',
    value: function decodeSignature() {
      return _eth.eth.utils.fromRpcSig(new Buffer(this.signature.substr(2), 'hex'));
    }

    /**
     * Extract values from a signed message.
     * This function expects a particular message structure which looks like this:
     * @example
     * Header title
     * propery1: value1
     * propery2: value2
     * ...etc
     * @param  {Array<string>|string} property - Property name or names to find
     * @return {Array<string>} - The found values or null for each of the supplied properties
     */

  }, {
    key: 'extract',
    value: function extract(properties) {
      if (!Array.isArray(properties)) properties = [properties];

      var message = this.decodeMessage().toString();
      var result = [];

      properties.map(function (property) {
        var regexp = new RegExp('^' + property + ':\\s(.*)$', 'gim');
        var match = regexp.exec(message);

        var value = match && match[1];
        result.push(value);
      });

      return result;
    }
  }]);

  return SignedMessage;
}();