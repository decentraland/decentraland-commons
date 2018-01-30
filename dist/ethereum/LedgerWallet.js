'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LedgerWallet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _hwTransportU2f = require('@ledgerhq/hw-transport-u2f');

var _hwTransportU2f2 = _interopRequireDefault(_hwTransportU2f);

var _hwAppEth = require('@ledgerhq/hw-app-eth');

var _hwAppEth2 = _interopRequireDefault(_hwAppEth);

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _rpc = require('web3-provider-engine/subproviders/rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _ledgerWalletProvider = require('ledger-wallet-provider');

var _ledgerWalletProvider2 = _interopRequireDefault(_ledgerWalletProvider);

var _Wallet2 = require('./Wallet');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LedgerWallet = exports.LedgerWallet = function (_Wallet) {
  _inherits(LedgerWallet, _Wallet);

  _createClass(LedgerWallet, null, [{
    key: 'isSupported',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var devices;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _hwTransportU2f2.default.list();

              case 2:
                devices = _context.sent;
                return _context.abrupt('return', devices.length > 0);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isSupported() {
        return _ref.apply(this, arguments);
      }

      return isSupported;
    }()
    // eslint-disable-next-line

  }]);

  function LedgerWallet(account) {
    _classCallCheck(this, LedgerWallet);

    var _this = _possibleConstructorReturn(this, (LedgerWallet.__proto__ || Object.getPrototypeOf(LedgerWallet)).call(this, account));

    _this.ledger = null;
    return _this;
  }

  _createClass(LedgerWallet, [{
    key: 'connect',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(providerUrl) {
        var transport, ledger, accounts, provider;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _hwTransportU2f2.default.open(null, 2);

              case 2:
                transport = _context2.sent;
                ledger = new _hwAppEth2.default(transport);


                this.ledger = ledger;

                // FireFox hangs on indefinetly on `getAccounts`, so the second promise acts as a timeout
                _context2.next = 7;
                return Promise.race([this.getAccounts(), (0, _utils.sleep)(2000).then(function () {
                  return Promise.reject({ message: 'Timed out trying to connect to ledger' });
                })]);

              case 7:
                accounts = _context2.sent;


                if (!this.account) {
                  this.setAccount(accounts[0]);
                }

                _context2.next = 11;
                return this.getProvider(providerUrl);

              case 11:
                provider = _context2.sent;

                this.web3 = new _web2.default(provider);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function connect(_x) {
        return _ref2.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * It'll create a new provider using the providerUrl param for RPC calls
     * @param  {string} [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
     * @return {object} The web3 provider
     */

  }, {
    key: 'getProvider',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var providerUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://mainnet.infura.io/';
        var engine, ledgerWalletSubProvider;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                engine = new _web3ProviderEngine2.default();
                _context3.next = 3;
                return (0, _ledgerWalletProvider2.default)(LedgerWallet.derivationPath);

              case 3:
                ledgerWalletSubProvider = _context3.sent;


                engine.addProvider(ledgerWalletSubProvider);
                engine.addProvider(new _rpc2.default({
                  rpcUrl: providerUrl
                }));
                engine.start();

                return _context3.abrupt('return', engine);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getProvider() {
        return _ref3.apply(this, arguments);
      }

      return getProvider;
    }()
  }, {
    key: 'getAccounts',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var defaultAccount;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.ledger.getAddress(LedgerWallet.derivationPath);

              case 2:
                defaultAccount = _context4.sent;
                return _context4.abrupt('return', [defaultAccount.address]);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getAccounts() {
        return _ref4.apply(this, arguments);
      }

      return getAccounts;
    }()
  }, {
    key: 'sign',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message) {
        var _ref6, v, r, s;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.ledger.signPersonalMessage(LedgerWallet.derivationPath, message.substring(2));

              case 2:
                _ref6 = _context5.sent;
                v = _ref6.v;
                r = _ref6.r;
                s = _ref6.s;


                v = (v - 27).toString(16);
                if (v.length < 2) v = '0' + v;

                return _context5.abrupt('return', '0x' + r + s + v);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function sign(_x3) {
        return _ref5.apply(this, arguments);
      }

      return sign;
    }()
  }]);

  return LedgerWallet;
}(_Wallet2.Wallet);

LedgerWallet.derivationPath = "44'/60'/0'/0";