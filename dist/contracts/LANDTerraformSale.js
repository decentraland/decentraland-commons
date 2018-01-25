'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LANDTerraformSale = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LANDTerraformSale = require('./artifacts/LANDTerraformSale.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

var _log = require('../log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = new _log.Log('LANDTerraformSale');

/** LANDTerraformSale contract class */

var LANDTerraformSale = exports.LANDTerraformSale = function (_Contract) {
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
  }, {
    key: 'transferBackMANAMany',
    value: function transferBackMANAMany(addresses, amounts) {
      log.info('(transferBackMANAMany) ' + amounts + ' to ' + addresses);
      return this.transaction('transferBackMANAMany', addresses, amounts, {
        gas: 120000
      });
    }
  }], [{
    key: 'getContractName',
    value: function getContractName() {
      return 'LANDTerraformSale';
    }
  }, {
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('LAND_TERRAFORM_SALE_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _LANDTerraformSale.abi;
    }
  }]);

  return LANDTerraformSale;
}(_ethereum.Contract);