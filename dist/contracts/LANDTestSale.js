'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LANDTestSale = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LANDTestSale = require('./artifacts/LANDTestSale.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** LANDTestSale contract class */
var LANDTestSale = exports.LANDTestSale = function (_Contract) {
  _inherits(LANDTestSale, _Contract);

  function LANDTestSale() {
    _classCallCheck(this, LANDTestSale);

    return _possibleConstructorReturn(this, (LANDTestSale.__proto__ || Object.getPrototypeOf(LANDTestSale)).apply(this, arguments));
  }

  _createClass(LANDTestSale, [{
    key: 'buy',
    value: function buy(x, y) {
      return this.transaction('buy', x, y, { gas: 120000 });
    }
  }], [{
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('LAND_TEST_SALE_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _LANDTestSale.abi;
    }
  }]);

  return LANDTestSale;
}(_ethereum.Contract);