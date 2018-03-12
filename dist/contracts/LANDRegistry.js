'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LANDRegistry = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LANDRegistry = require('./artifacts/LANDRegistry.json');

var _ethereum = require('../ethereum');

var _env = require('../env');

var _commaSeparatedValues = require('comma-separated-values');

var _commaSeparatedValues2 = _interopRequireDefault(_commaSeparatedValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_NAME_LENGTH = 50;
var MAX_DESCRIPTION_LENGTH = 140;

/** LANDToken contract class */

var LANDRegistry = exports.LANDRegistry = function (_Contract) {
  _inherits(LANDRegistry, _Contract);

  function LANDRegistry() {
    _classCallCheck(this, LANDRegistry);

    return _possibleConstructorReturn(this, (LANDRegistry.__proto__ || Object.getPrototypeOf(LANDRegistry)).apply(this, arguments));
  }

  _createClass(LANDRegistry, [{
    key: 'updateManyLandData',
    value: function updateManyLandData(coordinates, data) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var x = coordinates.map(function (coor) {
        return coor.x;
      });
      var y = coordinates.map(function (coor) {
        return coor.y;
      });
      return this.transaction('updateManyLandData', x, y, data, opts);
    }
  }, {
    key: 'assignNewParcel',
    value: function assignNewParcel(x, y, address) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      opts = Object.assign({ gas: 4000000, gasPrice: 28 * 1e9 }, opts);
      return this.transaction('assignNewParcel', x, y, address, opts);
    }
  }, {
    key: 'assignMultipleParcels',
    value: function assignMultipleParcels(x, y, address) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      opts = Object.assign({ gas: 1000000, gasPrice: 28 * 1e9 }, opts);
      return this.transaction('assignMultipleParcels', x, y, address, opts);
    }
  }], [{
    key: 'getContractName',
    value: function getContractName() {
      return 'LANDRegistry';
    }
  }, {
    key: 'decodeLandData',
    value: function decodeLandData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var version = data.charAt(0);
      switch (version) {
        case '0':
          {
            var _CSV$parse$ = _slicedToArray(_commaSeparatedValues2.default.parse(data)[0], 4),
                _version = _CSV$parse$[0],
                name = _CSV$parse$[1],
                description = _CSV$parse$[2],
                ipns = _CSV$parse$[3];

            return {
              version: _version,
              // when a value is blank, csv.parse returns 0, so we fallback to empty string
              // to support stuff like `0,,,ipns:link`
              name: name || '',
              description: description || '',
              ipns: ipns || ''
            };
          }
        default:
          throw new Error('Unknown version when trying to decode land data: "' + data + '" (see https://github.com/decentraland/commons/blob/master/docs/land-data.md)');
      }
    }
  }, {
    key: 'encodeLandData',
    value: function encodeLandData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      switch (data.version.toString()) {
        case '0':
          {
            var version = data.version,
                name = data.name,
                description = data.description,
                ipns = data.ipns;

            if (name.length > MAX_NAME_LENGTH) {
              throw new Error('The name is too long, max length allowed is ' + MAX_NAME_LENGTH + ' chars');
            }
            if (description.length > MAX_DESCRIPTION_LENGTH) {
              throw new Error('The description is too long, max length allowed is ' + MAX_DESCRIPTION_LENGTH + ' chars');
            }
            return _commaSeparatedValues2.default.encode([[version, name, description, ipns]]);
          }
        default:
          throw new Error('Unknown version when trying to encode land data: "' + JSON.stringify(data) + '"\n          (see https://github.com/decentraland/commons/blob/master/docs/land-data.md)');
      }
    }
  }, {
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