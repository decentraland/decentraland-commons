'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeWallet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _Wallet2 = require('./Wallet');

var _Contract = require('../Contract');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeWallet = exports.NodeWallet = function (_Wallet) {
  _inherits(NodeWallet, _Wallet);

  function NodeWallet() {
    _classCallCheck(this, NodeWallet);

    return _possibleConstructorReturn(this, (NodeWallet.__proto__ || Object.getPrototypeOf(NodeWallet)).apply(this, arguments));
  }

  _createClass(NodeWallet, [{
    key: 'connect',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(providerUrl) {
        var provider, accounts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getProvider(providerUrl);

              case 2:
                provider = _context.sent;

                if (provider) {
                  _context.next = 5;
                  break;
                }

                throw new Error('Could not get a valid provider for web3');

              case 5:

                this.web3 = new _web2.default(provider);

                if (this.account) {
                  _context.next = 13;
                  break;
                }

                _context.next = 9;
                return this.getAccounts();

              case 9:
                accounts = _context.sent;

                if (!(accounts.length === 0)) {
                  _context.next = 12;
                  break;
                }

                throw new Error('Could not connect to web3');

              case 12:

                this.setAccount(accounts[0]);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect(_x) {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * It'll fetch the provider from the `window` object or default to a new HttpProvider instance
     * @param  {string} [providerURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
     * @return {object} The web3 provider
     */

  }, {
    key: 'getProvider',
    value: function getProvider() {
      var providerUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http://localhost:8545';

      return typeof window === 'undefined' ? new _web2.default.providers.HttpProvider(providerUrl) : window.web3 && window.web3.currentProvider;
    }
  }, {
    key: 'getAccounts',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Contract.Contract.transaction(this.web3.eth.getAccounts);

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getAccounts() {
        return _ref2.apply(this, arguments);
      }

      return getAccounts;
    }()
  }, {
    key: 'sign',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
        var sign;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                sign = this.web3.personal.sign.bind(this.web3.personal);
                _context3.next = 3;
                return _Contract.Contract.transaction(sign, message, this.account);

              case 3:
                return _context3.abrupt('return', _context3.sent);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sign(_x3) {
        return _ref3.apply(this, arguments);
      }

      return sign;
    }()
  }, {
    key: 'recover',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(message, signature) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.web3.personal.ecRecover(message, signature);

              case 2:
                return _context4.abrupt('return', _context4.sent);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function recover(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return recover;
    }()
  }]);

  return NodeWallet;
}(_Wallet2.Wallet);

NodeWallet.type = 'node';