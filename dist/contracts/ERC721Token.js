'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERC721Token = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ERC721Token = require('./artifacts/ERC721Token.json');

var _ethereum = require('../ethereum');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** ERC721Token contract class */
var ERC721Token = exports.ERC721Token = function (_Contract) {
  _inherits(ERC721Token, _Contract);

  function ERC721Token() {
    _classCallCheck(this, ERC721Token);

    return _possibleConstructorReturn(this, (ERC721Token.__proto__ || Object.getPrototypeOf(ERC721Token)).apply(this, arguments));
  }

  _createClass(ERC721Token, [{
    key: 'ownerOf',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tokenId) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.transaction('ownerOf', tokenId));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function ownerOf(_x) {
        return _ref.apply(this, arguments);
      }

      return ownerOf;
    }()
  }, {
    key: 'getBalance',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(owner) {
        var balance;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getBalanceWei(owner);

              case 2:
                balance = _context2.sent;
                return _context2.abrupt('return', _ethereum.eth.utils.fromWei(balance));

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
    value: function getBalanceWei(owner) {
      return this.call('balanceOf', owner);
    }
  }], [{
    key: 'getContractName',
    value: function getContractName() {
      return 'ERC721Token';
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _ERC721Token.abi;
    }
  }]);

  return ERC721Token;
}(_ethereum.Contract);