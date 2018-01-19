'use strict';

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _log = require('../log');

var _Contract = require('./Contract');

var _Contract2 = _interopRequireDefault(_Contract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('Ethereum');
var web3 = null;

/** @namespace */
var eth = {
  /**
   * Filled on .connect()
   */
  contracts: {},
  web3: null,

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: require('./ethUtils'),

  /**
   * Connect to web3
   * @param  {array<Contract>} [contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link Contract#setContracts}
   * @param  {string} [defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {object} [options] - Extra options for the ETH connection
   * @param  {string} [options.httpProviderUrl] - URL for an HTTP provider forwarded to {@link eth#getWeb3Provider}
   * @return {boolean} - True if the connection was successful
   */
  connect: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var contracts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var defaultAccount = arguments[1];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var httpProviderUrl, currentProvider, accounts;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(web3 !== null)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', true);

            case 2:
              httpProviderUrl = options.httpProviderUrl;
              currentProvider = this.getWeb3Provider(httpProviderUrl);

              if (currentProvider) {
                _context.next = 7;
                break;
              }

              log.info('Could not get a valid provider for web3');
              return _context.abrupt('return', false);

            case 7:

              log.info('Instantiating contracts');
              web3 = new _web2.default(currentProvider);
              this.web3 = web3;

              _context.t0 = defaultAccount;

              if (_context.t0) {
                _context.next = 15;
                break;
              }

              _context.next = 14;
              return this.getAccounts();

            case 14:
              _context.t0 = _context.sent;

            case 15:
              accounts = _context.t0;

              if (!(accounts.length === 0)) {
                _context.next = 20;
                break;
              }

              log.warn('Could not get the default address from web3, please try again');
              this.disconnect();
              return _context.abrupt('return', false);

            case 20:

              this.setAddress(accounts[0]);
              this.setContracts(contracts);

              log.info('Got ' + this.getAddress() + ' as current user address');
              return _context.abrupt('return', true);

            case 24:
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
  }(),
  disconnect: function disconnect() {
    if (web3) {
      this.setAddress(null);
    }
    web3 = null;
  },
  reconnect: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.disconnect();
              _context2.next = 3;
              return this.connect.apply(this, _args2);

            case 3:
              return _context2.abrupt('return', _context2.sent);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function reconnect() {
      return _ref2.apply(this, arguments);
    }

    return reconnect;
  }(),
  getContract: function getContract(name) {
    if (!this.contracts[name]) {
      throw new Error('The contract ' + name + ' not found. Did you add it to the \'.connect()\' call?');
    }

    return this.contracts[name];
  },
  getAccounts: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              log.info('Getting web3 accounts');
              _context3.next = 3;
              return _Contract2.default.transaction(web3.eth.getAccounts);

            case 3:
              return _context3.abrupt('return', _context3.sent);

            case 4:
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
  }(),


  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/commons/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} [contracts] - An array comprised of a a wide of options: objects defining contracts, Contract subclasses or Contract instances.
   */
  setContracts: function setContracts(contracts) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = contracts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var contractData = _step.value;

        var contract = null;

        if (_Contract2.default.isPrototypeOf(contractData)) {
          contract = new contractData();
        } else if (contractData instanceof _Contract2.default) {
          contract = contractData;
        } else {
          contract = new _Contract2.default(contractData);
        }

        var instance = web3.eth.contract(contract.abi).at(contract.address);
        contract.setInstance(instance);

        this.contracts[contract.name] = contract;
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
   * Gets the appropiate Web3 provider for the given environment.
   * It'll fetch it from the `window` on the browser or use a new HttpProvider instance on nodejs
   * @param  {string} [httpProviderURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
   * @return {object} The web3 provider
   */
  getWeb3Provider: function getWeb3Provider() {
    var httpProviderUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http://localhost:8545';

    return process.browser ? window.web3 && window.web3.currentProvider : new _web2.default.providers.HttpProvider(httpProviderUrl);
  },


  /**
   * Unlocks the current account with the given password
   * @param  {string} password - Account password
   * @return {boolean} Whether the operation was successfull or not
   */
  unlockAccount: function unlockAccount(password) {
    return web3.personal.unlockAccount(this.getAddress(), password);
  },


  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus: function fetchTxStatus(txId) {
    log.info('Getting ' + txId + ' status');
    return _Contract2.default.transaction(web3.eth.getTransaction, txId);
  },


  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  fetchTxReceipt: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(txId) {
      var receipt;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              log.info('Getting ' + txId + ' receipt');
              _context4.next = 3;
              return _Contract2.default.transaction(web3.eth.getTransactionReceipt, txId);

            case 3:
              receipt = _context4.sent;


              if (receipt) {
                receipt.logs = _Contract2.default.decodeLogs(receipt.logs);
              }

              return _context4.abrupt('return', receipt);

            case 6:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function fetchTxReceipt(_x4) {
      return _ref4.apply(this, arguments);
    }

    return fetchTxReceipt;
  }(),
  remoteSign: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message, address) {
      var sign;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              sign = web3.personal.sign.bind(web3.personal);
              _context5.next = 3;
              return _Contract2.default.transaction(sign, message, address);

            case 3:
              return _context5.abrupt('return', _context5.sent);

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function remoteSign(_x5, _x6) {
      return _ref5.apply(this, arguments);
    }

    return remoteSign;
  }(),
  remoteRecover: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(message, signature) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return web3.personal.ecRecover(message, signature);

            case 2:
              return _context6.abrupt('return', _context6.sent);

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function remoteRecover(_x7, _x8) {
      return _ref6.apply(this, arguments);
    }

    return remoteRecover;
  }(),
  setAddress: function setAddress(address) {
    web3.eth.defaultAccount = address;
  },
  getAddress: function getAddress() {
    return web3.eth.defaultAccount;
  },
  getBlock: function getBlock(blockNumber) {
    return web3.eth.getBlock(blockNumber);
  },
  setupFilter: function setupFilter(type) {
    return web3.eth.filter(type);
  }
};

module.exports = eth;