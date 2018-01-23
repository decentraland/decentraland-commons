'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ethUtils = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var web3utils = new _web2.default();

/**
 * Some utility functions to work with Ethereum dapps.
 * It also provides a reference to the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util}
 * @namespace
 */
var ethUtils = exports.ethUtils = _extends({}, _ethereumjsUtil2.default, {

  /**
   * Converts a given number into a BigNumber instance. Check {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3tobignumber} for more info.
   */
  toBigNumber: web3utils.toBigNumber,

  /**
   * Converts a number of wei into the desired unit
   * @param  {number|BigNumber} amount - Amount to parse
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei} for more info
   * @return {string} - Parsed result
   */
  fromWei: function fromWei(amount) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ether';

    amount = web3utils.toBigNumber(amount);
    return web3utils.fromWei(amount, unit).toNumber(10);
  },


  /**
   * Converts an ethereum unit into wei
   * @param  {number|BigNumber} amount - Amount to convert
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
   * @return {string} - Parsed result
   */
  toWei: function toWei(amount) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ether';

    amount = web3utils.toBigNumber(amount);
    return web3utils.toWei(amount, unit).toNumber(10);
  },
  toHex: function toHex(utf8) {
    return web3utils.toHex(utf8);
  },
  fromHex: function fromHex(hex) {
    return web3utils.toUtf8(hex);
  },


  /**
   * ECDSA sign some data
   * @param  {Buffer|string} data    - Data to sign. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {Buffer|string} privKey - private key to sign with. If it's a string, it'll converted to an hex Buffer
   * @return {string} vrs sign result concatenated as a string
   */
  localSign: function localSign(data, privKey) {
    if (typeof data === 'string') data = _ethereumjsUtil2.default.sha3(data);
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex');

    var vrs = _ethereumjsUtil2.default.ecsign(data, privKey);

    return vrs.r.toString('hex') + '||' + vrs.s.toString('hex') + '||' + vrs.v;
  },


  /**
   * ECDSA public key recovery from signature
   * @param  {Buffer|string} data  - Signed data. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {string} signature    - The result of calling `localSign`. Concatenated string of vrs sign
   * @return {string} public key hex value
   */
  localRecover: function localRecover(data, signature) {
    if (typeof data === 'string') {
      data = _ethereumjsUtil2.default.sha3(data);
    }

    var _signature$split = signature.split('||'),
        _signature$split2 = _slicedToArray(_signature$split, 3),
        r = _signature$split2[0],
        s = _signature$split2[1],
        v = _signature$split2[2];

    r = Buffer.from(r, 'hex');
    s = Buffer.from(s, 'hex');
    v = parseInt(v, 10);

    var publicKey = _ethereumjsUtil2.default.ecrecover(data, v, r, s);

    return publicKey.toString('hex');
  },


  /**
   * Returns the ethereum public key of a given private key
   * @param  {Buffer|string} privKey - private key from where to derive the public key
   * @return {string} Hex public key
   */
  privateToPublicHex: function privateToPublicHex(privKey) {
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex');
    return _ethereumjsUtil2.default.privateToPublic(privKey).toString('hex');
  },


  /**
   * Returns the ethereum address for a given public key
   * @param  {string} pubKey - public key from where to derive the address
   * @return {string} Hex address
   */
  pubToAddressHex: function pubToAddressHex(pubkey) {
    return _ethereumjsUtil2.default.pubToAddress(pubkey).toString('hex');
  }
});