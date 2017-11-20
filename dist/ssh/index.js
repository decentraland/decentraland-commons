'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tunnelSsh = require('tunnel-ssh');

var _tunnelSsh2 = _interopRequireDefault(_tunnelSsh);

var _log = require('../log');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('SSH');

/**
 * Connect via an SSH tunnel. It uses tunnel-ssh behind the scenes. Check {@link https://github.com/agebrock/tunnel-ssh} for more info.
 * @namespace
 */
var tunnel = {
  /**
   * Connect using an SSH tunnel
   * @param  {object|string} configOrPath - Object or path to JSON file which describes the connection. See {@link tunnel#readTunnelConfig}
   * @return {Promise<number>} - Fires when the tunnel connection has been stablished. It receives the tunnel port as a parameter
   */
  connect: function connect(configOrPath) {
    var _this = this;

    var tunnelConfig = this.readTunnelConfig(configOrPath);

    if (!tunnelConfig) {
      throw new Error('Tried to connect to ssh tunnel without a valid configuration');
    }

    log.info('Connecting to SSH tunnel');
    var currentTunnel = null;

    return new Promise(function (resolve, reject) {
      return (0, _tunnelSsh2.default)(tunnelConfig, function (error, _tunnel) {
        currentTunnel = _tunnel;
        resolve(tunnelConfig.localPort);
      }).on('error', function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, tunnel) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  log.info('Tunnel error', error.toString());
                  if (currentTunnel) currentTunnel.close();

                  _this.close();
                  _context.next = 5;
                  return (0, _utils.sleep)(1000);

                case 5:

                  tunnel.connect(configOrPath).then(resolve).catch(reject);

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  },

  /**
   * Uses an object or reads one from the file system describing the connection.
   * @example <caption>A minimal example contains</caption>
   * {
   *   'username': 'remote_username',
   *   'host': 'remote_host',
   *   'privateKey': 'path_to_private_key',
   *   'port': 22024,
   *   'dstPort': 27017,
   *   'localPort': ''
   * }
   * @param  {object|string} configOrPath - The manifest for the tunnel configuration. It can be the filesystem path to the json file or the object itself.
   * @return {object} - The parsed configuration
   */
  readTunnelConfig: function readTunnelConfig(configOrPath) {
    var tunnelConfig = null;

    if (typeof configOrPath === 'string') {
      tunnelConfig = _fs2.default.readFileSync(configOrPath);
      tunnelConfig = JSON.parse(tunnelConfig);
    } else {
      tunnelConfig = Object.assign({}, configOrPath);
    }

    if (tunnelConfig && tunnelConfig.privateKey) {
      tunnelConfig.privateKey = _fs2.default.readFileSync(tunnelConfig.privateKey);
    }

    return tunnelConfig;
  }
};

module.exports = tunnel;