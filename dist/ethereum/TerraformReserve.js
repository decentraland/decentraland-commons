"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TerraformReserve = require("../contracts/TerraformReserve.json");

var _log = require("../log");

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

var _Contract2 = require("./Contract");

var _Contract3 = _interopRequireDefault(_Contract2);

var _eth = require("./eth");

var _eth2 = _interopRequireDefault(_eth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = new _log.Log("[TerraformReserve]");
var instance = null;

/** TerraformReserve contract class */

var TerraformReserve = function (_Contract) {
  _inherits(TerraformReserve, _Contract);

  function TerraformReserve() {
    _classCallCheck(this, TerraformReserve);

    return _possibleConstructorReturn(this, (TerraformReserve.__proto__ || Object.getPrototypeOf(TerraformReserve)).apply(this, arguments));
  }

  _createClass(TerraformReserve, [{
    key: "lockMana",
    value: function lockMana(sender, mana) {
      return this.lockManaWei(sender, _eth2.default.utils.toWei(mana));
    }
  }, {
    key: "lockManaWei",
    value: function lockManaWei(sender, mana) {
      log.info("Locking " + mana + "MANA for " + _eth2.default.getAddress());
      _eth2.default.unlockAccount();
      return this.transaction("lockMana", sender, mana, { gas: 120000 });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!instance) {
        // Support create-react-app imports
        var address = _env2.default.get("RESERVE_CONTRACT_ADDRESS", _env2.default.get("REACT_APP_RESERVE_CONTRACT_ADDRESS", ""));

        instance = new TerraformReserve("TerraformReserve", address, _TerraformReserve.abi);
      }
      return instance;
    }
  }]);

  return TerraformReserve;
}(_Contract3.default);

module.exports = TerraformReserve;