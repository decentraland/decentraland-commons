'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerraformReserve = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TerraformReserve = require('./artifacts/TerraformReserve.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** TerraformReserve contract class */
var TerraformReserve = exports.TerraformReserve = function (_Contract) {
  _inherits(TerraformReserve, _Contract);

  function TerraformReserve() {
    _classCallCheck(this, TerraformReserve);

    return _possibleConstructorReturn(this, (TerraformReserve.__proto__ || Object.getPrototypeOf(TerraformReserve)).apply(this, arguments));
  }

  _createClass(TerraformReserve, [{
    key: 'lockMana',
    value: function lockMana(sender, mana) {
      return this.lockManaWei(sender, _ethereum.eth.utils.toWei(mana));
    }
  }, {
    key: 'lockManaWei',
    value: function lockManaWei(sender, mana) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { gas: 1200 };

      _ethereum.eth.unlockAccount();
      return this.transaction('lockMana', sender, mana, opts);
    }
  }], [{
    key: 'getContractName',
    value: function getContractName() {
      return 'TerraformReserve';
    }
  }, {
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _TerraformReserve.abi;
    }
  }]);

  return TerraformReserve;
}(_ethereum.Contract);