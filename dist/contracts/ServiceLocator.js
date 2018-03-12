'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceLocator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ServiceLocator = require('./artifacts/ServiceLocator.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** ServiceLocator contract class */
var ServiceLocator = exports.ServiceLocator = function (_Contract) {
  _inherits(ServiceLocator, _Contract);

  function ServiceLocator() {
    _classCallCheck(this, ServiceLocator);

    return _possibleConstructorReturn(this, (ServiceLocator.__proto__ || Object.getPrototypeOf(ServiceLocator)).apply(this, arguments));
  }

  _createClass(ServiceLocator, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(namespace) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.transaction('get', namespace));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'getNamespace',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(address) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.transaction('getNamespace', address));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getNamespace(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getNamespace;
    }()
  }], [{
    key: 'getContractName',
    value: function getContractName() {
      return 'ServiceLocator';
    }
  }, {
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      // Default ServiceLocator
      return _env.env.universalGet('SERVICE_LOCATOR_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _ServiceLocator.abi;
    }
  }]);

  return ServiceLocator;
}(_ethereum.Contract);