'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReturnMANA = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ReturnMANA = require('./artifacts/ReturnMANA.json');

var _ethereum = require('./ethereum');

var _env = require('../env');

var _log = require('../log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = new _log.Log('ReturnMANA');

/** ReturnMANA contract class */

var ReturnMANA = exports.ReturnMANA = function (_Contract) {
  _inherits(ReturnMANA, _Contract);

  function ReturnMANA() {
    _classCallCheck(this, ReturnMANA);

    return _possibleConstructorReturn(this, (ReturnMANA.__proto__ || Object.getPrototypeOf(ReturnMANA)).apply(this, arguments));
  }

  _createClass(ReturnMANA, [{
    key: 'burn',
    value: function burn(amount) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      log.info('(burn) ' + amount + ' MANA');

      return this.transaction('burn', amount, Object.assign({}, { gas: 120000 }, opts));
    }
  }, {
    key: 'transferBackMANA',
    value: function transferBackMANA(address, amount) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      log.info('(transferBackMANA) ' + amount + ' to ' + address);

      return this.transaction('transferBackMANA', address, amount, Object.assign({}, { gas: 120000 }, opts));
    }
  }, {
    key: 'transferBackMANAMany',
    value: function transferBackMANAMany(addresses, amounts) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      log.info('(transferBackMANAMany) ' + amounts + ' to ' + addresses);

      return this.transaction('transferBackMANAMany', addresses, amounts, Object.assign({}, { gas: 120000 }, opts));
    }
  }], [{
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('RETURN_MANA_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _ReturnMANA.abi;
    }
  }]);

  return ReturnMANA;
}(_ethereum.Contract);