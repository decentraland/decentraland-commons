'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _env = require('../env');

var env = _interopRequireWildcard(_env);

var _log = require('../log');

var _Contract2 = require('./Contract');

var _Contract3 = _interopRequireDefault(_Contract2);

var _ReturnMANA = require('../contracts/ReturnMANA.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = new _log.Log('ReturnMANA');
var instance = null;

/** ReturnMANA contract class */

var ReturnMANA = function (_Contract) {
  _inherits(ReturnMANA, _Contract);

  function ReturnMANA() {
    _classCallCheck(this, ReturnMANA);

    return _possibleConstructorReturn(this, (ReturnMANA.__proto__ || Object.getPrototypeOf(ReturnMANA)).apply(this, arguments));
  }

  _createClass(ReturnMANA, [{
    key: 'burn',
    value: function burn(amount) {
      log.info('(burn) ' + amount + ' MANA');
      return this.transaction('burn', amount, {
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
    key: 'getInstance',
    value: function getInstance() {
      if (!instance) {
        instance = new ReturnMANA('ReturnMANA', env.get('RETURN_MANA_ADDRESS', function (name) {
          return env.get('REACT_APP_RETURN_MANA_ADDRESS', function () {
            if (env.isProduction()) {
              throw new Error('Missing RETURN_MANA_ADDRESS or REACT_APP_RETURN_MANA_ADDRESS');
            }
            return '0xd9824914a1b1d4b5c9a135fb1e8312f6b2c3e37f';
          });
        }), _ReturnMANA.abi);
      }
      return instance;
    }
  }]);

  return ReturnMANA;
}(_Contract3.default);

module.exports = ReturnMANA;