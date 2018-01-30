'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eth = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _log = require('../log');

var _NodeWallet = require('./NodeWallet');

var _LedgerWallet = require('./LedgerWallet');

var _Contract = require('./Contract');

var _ethUtils = require('./ethUtils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('Ethereum');
var web3 = null;

/** @namespace */
var eth = exports.eth = {
  /**
   * Filled on .connect()
   */
  contracts: {},
  wallet: null,

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: _ethUtils.ethUtils,

  /**
   * Connect to web3
   * @param  {object} [options] - Options for the ETH connection
   * @param  {array<Contract>} [options.contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts}
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.providerUrl] - URL for a provider forwarded to {@link Wallet#getWeb3Provider}
   * @return {boolean} - True if the connection was successful
   */
  connect: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _options$contracts, contracts, defaultAccount, providerUrl;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.wallet && this.wallet.isConnected()) {
                this.disconnect();
              }

              _options$contracts = options.contracts, contracts = _options$contracts === undefined ? [] : _options$contracts, defaultAccount = options.defaultAccount, providerUrl = options.providerUrl;
              _context.prev = 2;
              _context.next = 5;
              return this.createWallet(defaultAccount, providerUrl);

            case 5:
              this.wallet = _context.sent;

              web3 = this.wallet.getWeb3();

              this.setContracts(contracts);

              return _context.abrupt('return', true);

            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](2);

              log.info('Error trying to connect Ethereum wallet: ' + _context.t0.message);
              return _context.abrupt('return', false);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 11]]);
    }));

    function connect() {
      return _ref.apply(this, arguments);
    }

    return connect;
  }(),
  createWallet: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(defaultAccount, providerUrl) {
      var wallet;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              wallet = void 0;
              _context2.prev = 1;

              wallet = new _LedgerWallet.LedgerWallet(defaultAccount);
              _context2.next = 5;
              return wallet.connect(providerUrl);

            case 5:
              _context2.next = 12;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2['catch'](1);

              wallet = new _NodeWallet.NodeWallet(defaultAccount);
              _context2.next = 12;
              return wallet.connect(providerUrl);

            case 12:
              return _context2.abrupt('return', wallet);

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 7]]);
    }));

    function createWallet(_x2, _x3) {
      return _ref2.apply(this, arguments);
    }

    return createWallet;
  }(),
  disconnect: function disconnect() {
    if (this.wallet) {
      this.wallet.disconnect();
    }
    this.wallet = null;
    this.contracts = {};
    web3 = null;
  },
  getAddress: function getAddress() {
    return this.getAccount();
  },
  getAccount: function getAccount() {
    return this.wallet.getAccount();
  },


  /**
   * Get a contract instance built on {@link eth#setContracts}
   * It'll throw if the contract is not found on the `contracts` mapping
   * @param  {string} name - Contract name
   * @return {object} contract
   */
  getContract: function getContract(name) {
    if (!this.contracts[name]) {
      var contractNames = Object.keys(this.contracts);
      throw new Error('The contract ' + name + ' not found.\nDid you add it to the \'.connect()\' call?\nAvailable contracts are ' + contractNames);
    }

    return this.contracts[name];
  },


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
        var contractName = null;

        if (typeof contractData === 'function') {
          // contractData is subclass of Contract
          contract = new contractData();
          contractName = contractData.getContractName();
        } else if ((typeof contractData === 'undefined' ? 'undefined' : _typeof(contractData)) === 'object' && !this.isContractOptions(contractData)) {
          // contractData is an instance of Contract or of one of its children
          contract = contractData;
          contractName = contractData.constructor.getContractName();
        } else {
          // contractData is an object defining the contract
          contract = new _Contract.Contract(contractData);
          contractName = contractData.name;
        }

        if (!contractName) continue; // skip

        var instance = this.wallet.createContractInstance(contract.abi, contract.address);
        contract.setInstance(instance);

        this.contracts[contractName] = contract;
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
  isContractOptions: function isContractOptions(contractData) {
    return 'name' in contractData && 'address' in contractData && 'abi' in contractData;
  },


  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus: function fetchTxStatus(txId) {
    return _Contract.Contract.transaction(web3.eth.getTransaction, txId);
  },


  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  fetchTxReceipt: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(txId) {
      var receipt;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _Contract.Contract.transaction(web3.eth.getTransactionReceipt, txId);

            case 2:
              receipt = _context3.sent;


              if (receipt) {
                receipt.logs = _Contract.Contract.decodeLogs(receipt.logs);
              }

              return _context3.abrupt('return', receipt);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function fetchTxReceipt(_x4) {
      return _ref3.apply(this, arguments);
    }

    return fetchTxReceipt;
  }(),
  sign: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(payload) {
      var message, signature;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              message = this.utils.toHex(payload);
              _context4.next = 3;
              return this.wallet.sign(message);

            case 3:
              signature = _context4.sent;
              return _context4.abrupt('return', { message: message, signature: signature });

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function sign(_x5) {
      return _ref4.apply(this, arguments);
    }

    return sign;
  }(),
  recover: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message, signature) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.wallet.recover(message, signature);

            case 2:
              return _context5.abrupt('return', _context5.sent);

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function recover(_x6, _x7) {
      return _ref5.apply(this, arguments);
    }

    return recover;
  }()
};