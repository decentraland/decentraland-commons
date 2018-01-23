'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MANAToken = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MANAToken = require('./artifacts/MANAToken.json');

var _TerraformReserve = require('./TerraformReserve');

var _ethereum = require('../ethereum');

var _env = require('../env');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** MANAToken contract class */
var MANAToken = exports.MANAToken = function (_Contract) {
  _inherits(MANAToken, _Contract);

  function MANAToken() {
    _classCallCheck(this, MANAToken);

    return _possibleConstructorReturn(this, (MANAToken.__proto__ || Object.getPrototypeOf(MANAToken)).apply(this, arguments));
  }

  _createClass(MANAToken, [{
    key: 'getAllowance',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sender) {
        var assigned;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getAllowanceWei(sender);

              case 2:
                assigned = _context.sent;
                return _context.abrupt('return', _ethereum.eth.utils.fromWei(assigned));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAllowance(_x) {
        return _ref.apply(this, arguments);
      }

      return getAllowance;
    }()
  }, {
    key: 'getAllowanceWei',
    value: function getAllowanceWei(sender) {
      return this.call('allowance', sender, _TerraformReserve.TerraformReserve.getDefaultAddress());
    }
  }, {
    key: 'getBalance',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sender) {
        var manaBalance;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getBalanceWei(sender);

              case 2:
                manaBalance = _context2.sent;
                return _context2.abrupt('return', _ethereum.eth.utils.fromWei(manaBalance));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getBalance(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getBalance;
    }()
  }, {
    key: 'getBalanceWei',
    value: function getBalanceWei(sender) {
      return this.call('balanceOf', sender);
    }
  }], [{
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('MANA_TOKEN_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _MANAToken.abi;
    }
  }]);

  return MANAToken;
}(_ethereum.Contract);