"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _env = require("../env");

var env = _interopRequireWildcard(_env);

var _Contract2 = require("./Contract");

var _Contract3 = _interopRequireDefault(_Contract2);

var _LANDTestSale = require("../contracts/LANDTestSale.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var instance = null;

/** LANDTestSale contract class */

var LANDTestSale = function (_Contract) {
  _inherits(LANDTestSale, _Contract);

  function LANDTestSale() {
    _classCallCheck(this, LANDTestSale);

    return _possibleConstructorReturn(this, (LANDTestSale.__proto__ || Object.getPrototypeOf(LANDTestSale)).apply(this, arguments));
  }

  _createClass(LANDTestSale, [{
    key: "buy",
    value: function buy(x, y) {
      return this.transaction("buy", x, y, { gas: 120000 });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!instance) {
        instance = new LANDTestSale("LANDTestSale", env.get("LAND_TEST_SALE_CONTRACT_ADDRESS", function (name) {
          if (env.isProduction()) {
            throw new Error("Missing env: " + name);
          }
          return "0x32345987770c17796bdb0a8d9492d468f53054c1";
        }), _LANDTestSale.abi);
      }
      return instance;
    }
  }]);

  return LANDTestSale;
}(_Contract3.default);

module.exports = LANDTestSale;