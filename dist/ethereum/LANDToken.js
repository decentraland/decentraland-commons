'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LANDToken = require('../contracts/LANDToken.json');

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

var _Contract2 = require('./Contract');

var _Contract3 = _interopRequireDefault(_Contract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var instance = null;

/** LANDToken contract class */

var LANDToken = function (_Contract) {
  _inherits(LANDToken, _Contract);

  function LANDToken() {
    _classCallCheck(this, LANDToken);

    return _possibleConstructorReturn(this, (LANDToken.__proto__ || Object.getPrototypeOf(LANDToken)).apply(this, arguments));
  }

  _createClass(LANDToken, [{
    key: 'getMetadata',
    value: function getMetadata(x, y) {
      return this.call('landMetadata', x, y);
    }
  }, {
    key: 'updateMetadata',
    value: function updateMetadata(coordinates, metadata) {
      var x = coordinates.map(function (coor) {
        return coor.x;
      });
      var y = coordinates.map(function (coor) {
        return coor.y;
      });
      return this.transaction('updateManyLandMetadata', x, y, metadata);
    }
  }, {
    key: 'getOwner',
    value: function getOwner(x, y) {
      return this.call('ownerOfLand', x, y);
    }
  }, {
    key: 'buildTokenId',
    value: function buildTokenId(x, y) {
      return this.call('buildTokenId', x, y);
    }
  }, {
    key: 'ping',
    value: function ping(x, y) {
      return this.transaction('ping', x, y);
    }
  }, {
    key: 'exists',
    value: function exists(x, y) {
      return this.call('exists', x, y);
    }
  }, {
    key: 'transferTo',
    value: function transferTo(x, y, newOwner) {
      return this.transaction('transferLand', newOwner, x, y);
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!instance) {
        // Support create-react-app imports
        var address = _env2.default.get('LAND_CONTRACT_ADDRESS', _env2.default.get('REACT_APP_LAND_CONTRACT_ADDRESS', function () {
          if (_env2.default.isProduction()) {
            throw new Error('Missing LAND_CONTRACT_ADDRESS or REACT_APP_LAND_CONTRACT_ADDRESS');
          }
          return '0x89021CCAF582aC748A7F21cAeF68cC7b9FE17FC5';
        }));

        instance = new LANDToken('LANDToken', address, _LANDToken.abi);
      }
      return instance;
    }
  }]);

  return LANDToken;
}(_Contract3.default);

module.exports = LANDToken;