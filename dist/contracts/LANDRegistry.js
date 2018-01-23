'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LANDRegistry = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LANDRegistry = require('./artifacts/LANDRegistry.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** LANDToken contract class */
var LANDRegistry = exports.LANDRegistry = function (_Contract) {
  _inherits(LANDRegistry, _Contract);

  function LANDRegistry() {
    _classCallCheck(this, LANDRegistry);

    return _possibleConstructorReturn(this, (LANDRegistry.__proto__ || Object.getPrototypeOf(LANDRegistry)).apply(this, arguments));
  }

  _createClass(LANDRegistry, [{
    key: 'getData',
    value: function getData(x, y) {
      return this.call('landData', x, y);
    }
  }, {
    key: 'updateManyLandData',
    value: function updateManyLandData(coordinates, data) {
      var x = coordinates.map(function (coor) {
        return coor.x;
      });
      var y = coordinates.map(function (coor) {
        return coor.y;
      });
      return this.transaction('updateManyLandData', x, y, data);
    }
  }, {
    key: 'getOwner',
    value: function getOwner(x, y) {
      return this.call('ownerOfLand', x, y);
    }
  }, {
    key: 'encodeTokenId',
    value: function encodeTokenId(x, y) {
      return this.call('encodeTokenId', x, y);
    }
  }, {
    key: 'decodeTokenId',
    value: function decodeTokenId(value) {
      return this.call('decodeTokenId', value);
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
  }, {
    key: 'assetsOf',
    value: function assetsOf(address) {
      return this.transaction('assetsOf', address);
    }
  }, {
    key: 'ownerOfLand',
    value: function ownerOfLand(x, y) {
      return this.call('ownerOfLand', x, y);
    }
  }, {
    key: 'ownerOfLandMany',
    value: function ownerOfLandMany(x, y) {
      return this.call('ownerOfLandMany', x, y);
    }
  }, {
    key: 'landOf',
    value: function landOf(owner) {
      return this.call('landOf', owner);
    }
  }, {
    key: 'assignNewParcel',
    value: function assignNewParcel(x, y, address) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return this.transaction('assignNewParcel', x, y, address, Object.assign({}, { gas: 4000000, gasPrice: 28 * 1e9 }, opts));
    }
  }, {
    key: 'assignMultipleParcels',
    value: function assignMultipleParcels(x, y, address) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return this.transaction('assignMultipleParcels', x, y, address, Object.assign({}, { gas: 1000000, gasPrice: 28 * 1e9 }, opts));
    }
  }], [{
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return _env.env.universalGet('LAND_REGISTRY_CONTRACT_ADDRESS');
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _LANDRegistry.abi;
    }
  }]);

  return LANDRegistry;
}(_ethereum.Contract);