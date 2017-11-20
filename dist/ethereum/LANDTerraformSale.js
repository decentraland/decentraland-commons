'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _env = require('../env');

var env = _interopRequireWildcard(_env);

var _log = require('../log');

var _Contract2 = require('./Contract');

var _Contract3 = _interopRequireDefault(_Contract2);

var _LANDTerraformSale = require('../contracts/LANDTerraformSale.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = new _log.Log('LANDTerraformSale');
var instance = null;

/** LANDTerraformSale contract class */

var LANDTerraformSale = function (_Contract) {
  _inherits(LANDTerraformSale, _Contract);

  function LANDTerraformSale() {
    _classCallCheck(this, LANDTerraformSale);

    return _possibleConstructorReturn(this, (LANDTerraformSale.__proto__ || Object.getPrototypeOf(LANDTerraformSale)).apply(this, arguments));
  }

  _createClass(LANDTerraformSale, [{
    key: 'buyMany',
    value: function buyMany(buyer, xList, yList, totalCost) {
      log.info('(buyMany) LAND for ' + buyer);
      return this.transaction('buyMany', buyer, xList, yList, totalCost, {
        gas: 120000
      });
    }
  }, {
    key: 'transferBackMANA',
    value: function transferBackMANA(address, amount) {
      log.info('(transferBackMANA) ' + amount + ' to ' + address);
      return this.transaction('transferBackMANA', address, amount, {
        gas: 120000
      });
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!instance) {
        instance = new LANDTerraformSale('LANDTerraformSale', env.get('TERRAFORM_CONTRACT_ADDRESS', function (name) {
          return env.get('REACT_APP_TERRAFORM_CONTRACT_ADDRESS', function () {
            if (env.isProduction()) {
              throw new Error('Missing TERRAFORM_CONTRACT_ADDRESS or REACT_APP_TERRAFORM_CONTRACT_ADDRESS');
            }
            return '0x4bc79175f1f6fded07f04aa1b4b0465ecff6f1b3';
          });
        }), _LANDTerraformSale.abi);
      }
      return instance;
    }
  }]);

  return LANDTerraformSale;
}(_Contract3.default);

module.exports = LANDTerraformSale;