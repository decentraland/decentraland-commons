'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Interface
var Wallet = exports.Wallet = function () {
  function Wallet(account) {
    _classCallCheck(this, Wallet);

    this.web3 = null;
    this.account = null;
    this.type = this.constructor.type;
  }

  _createClass(Wallet, [{
    key: 'isConnected',
    value: function isConnected() {
      return this.web3 && !!this.web3.eth;
    }
  }, {
    key: 'getWeb3',
    value: function getWeb3() {
      return this.web3;
    }
  }, {
    key: 'getAccount',
    value: function getAccount() {
      return this.account;
    }
  }, {
    key: 'setAccount',
    value: function setAccount(account) {
      if (this.isConnected()) {
        this.web3.eth.defaultAccount = account;
      }
      this.account = account;
    }
  }, {
    key: 'connect',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw new Error('Not implemented. Check wallet support');

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect() {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.web3 = null;
      this.setAccount(null);
    }

    /**
     * Gets the appropiate Web3 provider for the given environment.
     * Check each implementation for in detail information
     * @param  {string} [providerURL] - URL for a provider.
     * @return {object} The web3 provider
     */

  }, {
    key: 'getProvider',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(providerUrl) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                throw new Error('Not implemented. Check wallet support');

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getProvider(_x) {
        return _ref2.apply(this, arguments);
      }

      return getProvider;
    }()

    /**
     * Return available accounts for the current wallet
     * @return {Promise<array<string>>} accounts
     */

  }, {
    key: 'getAccounts',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                throw new Error('Not implemented. Check wallet support');

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAccounts() {
        return _ref3.apply(this, arguments);
      }

      return getAccounts;
    }()

    /**
     * Creates a new contract instance with all its methods and events defined in its json interface object (abi).
     * @param  {object} abi     - Application Binary Interface.
     * @param  {string} address - Contract address
     * @return {object} instance
     */

  }, {
    key: 'createContractInstance',
    value: function createContractInstance(abi, address) {
      return this.web3.eth.contract(abi).at(address);
    }

    /**
     * Unlocks the current account with the given password
     * @param  {string} password - Account password
     * @return {boolean} Whether the operation was successfull or not
     */

  }, {
    key: 'unlockAccount',
    value: function unlockAccount(password) {
      return this.web3.personal.unlockAccount(this.account, password);
    }

    /**
     * Signs data from the default account
     * @param  {string} message - Message to sign, ussually in Hex
     * @return {Promise<string>} signature
     */

  }, {
    key: 'sign',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(message) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                throw new Error('Not implemented. Check wallet support');

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function sign(_x2) {
        return _ref4.apply(this, arguments);
      }

      return sign;
    }()

    /**
     * Recovers the account that signed the data
     * @param  {string} message   - Data that was signed
     * @param  {string} signature
     * @return {Promise<string>} account
     */

  }, {
    key: 'recover',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message, signature) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                throw new Error('Not implemented. Check wallet support');

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function recover(_x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return recover;
    }()
  }]);

  return Wallet;
}();

Wallet.type = '';