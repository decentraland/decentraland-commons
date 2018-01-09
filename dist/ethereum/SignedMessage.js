'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eth = require('./eth');

var _eth2 = _interopRequireDefault(_eth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Work with signatures made with Ethereum wallets
 */
var SignedMessage = function () {
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

      var pubkey = _eth2.default.utils.ecrecover(_eth2.default.utils.hashPersonalMessage(decodedMessage), v, r, s);

      return '0x' + _eth2.default.utils.pubToAddress(pubkey).toString('hex');
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
      return _eth2.default.utils.fromRpcSig(new Buffer(this.signature.substr(2), 'hex'));
    }

    /**
     * Extract a value from a signed message. This function expects a particular message structure like this:
     * @example
     * Header title
     * propery1: value1
     * propery2: value2
     * ...etc
     * @param  {string} property - Property name to find
     * @return {object} - The value for the supplied propery or undefined
     */

  }, {
    key: 'extract',
    value: function extract(property) {
      var propMatch = '^' + property + ':\\s(.*)$';
      var regexp = new RegExp(propMatch, 'gim');

      var match = regexp.exec(this.message);
      return match && match[1];
    }
  }]);

  return SignedMessage;
}();

exports.default = SignedMessage;