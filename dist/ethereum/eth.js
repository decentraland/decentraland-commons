"use strict";

var _web = require("web3");

var _web2 = _interopRequireDefault(_web);

var _log = require("../log");

var _env = require("../env");

var env = _interopRequireWildcard(_env);

var _Contract = require("./Contract");

var _Contract2 = _interopRequireDefault(_Contract);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log("[Ethrereum]");
var web3 = null;

/** @namespace */
var eth = {
  contracts: {}, // Filled on .connect()

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: require("./ethUtils"),

  /**
   * Connect to web3
   * @param  {string} [defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use. By default will use the available contracts.
   * @return {boolean} - True if the connection was successful
   */
  connect: function connect(defaultAccount, contracts) {
    if (web3 !== null) return;

    var currentProvider = this.getWeb3Provider();
    if (!currentProvider) {
      log.info("Could not get a valid provider for web3");
      return false;
    }

    log.info("Instantiating contracts");
    web3 = new _web2.default(currentProvider);

    this.setAddress(defaultAccount || web3.eth.accounts[0]);
    this.setContracts(contracts || this._getDefaultContracts());

    if (!this.getAddress()) {
      log.warn("Could not get the default address from web3");
      return false;
    }

    log.info("Got " + this.getAddress() + " as current user address");
    return true;
  },


  // Internal. Dynamic require
  _getDefaultContracts: function _getDefaultContracts() {
    return [require("./MANAToken"), require("./TerraformReserve")];
  },
  getContract: function getContract(name) {
    if (!this.contracts[name]) {
      throw new Error("The contract " + name + " not found. Did you add it to the '.connect()' call?");
    }

    return this.contracts[name];
  },


  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * Usable later via `.getContract`
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use.
   */
  setContracts: function setContracts(contracts) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = contracts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var contract = _step.value;

        contract = _Contract2.default.isPrototypeOf(contract) ? contract.getInstance() : new _Contract2.default(contract);

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
  getWeb3Provider: function getWeb3Provider() {
    return process.browser ? window.web3 && window.web3.currentProvider : new _web2.default.providers.HttpProvider(env.getEnv("WEB3_HTTP_PROVIDER", "http://localhost:8545"));
  },
  unlockAccount: function unlockAccount() {
    return web3.personal.unlockAccount(this.getAddress(), env.getEnv("WEB3_ACCOUNT_PASSWORD", ""));
  },


  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus: function fetchTxStatus(txId) {
    log.info("Getting " + txId + " status");
    return _Contract2.default.transaction(web3.eth.getTransaction, txId);
  },


  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction recepeit (if it exists) with it's logs
   */
  fetchTxReceipt: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(txId) {
      var recepeit;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              log.info("Getting " + txId + " recepeit");
              _context.next = 3;
              return _Contract2.default.transaction(web3.eth.getTransactionReceipt, txId);

            case 3:
              recepeit = _context.sent;


              if (recepeit) {
                recepeit.logs = _Contract2.default.decodeLogs(recepeit.logs);
              }

              return _context.abrupt("return", recepeit);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function fetchTxReceipt(_x) {
      return _ref.apply(this, arguments);
    }

    return fetchTxReceipt;
  }(),
  remoteSign: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message, address) {
      var sign;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              sign = web3.personal.sign.bind(web3.personal);
              _context2.next = 3;
              return _Contract2.default.transaction(sign, message, address);

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function remoteSign(_x2, _x3) {
      return _ref2.apply(this, arguments);
    }

    return remoteSign;
  }(),
  remoteRecover: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message, signature) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return web3.personal.ecRecover(message, signature);

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function remoteRecover(_x4, _x5) {
      return _ref3.apply(this, arguments);
    }

    return remoteRecover;
  }(),
  setAddress: function setAddress(address) {
    web3.eth.defaultAccount = address;
  },
  getAddress: function getAddress() {
    return web3.eth.defaultAccount;
  }
};

module.exports = eth;