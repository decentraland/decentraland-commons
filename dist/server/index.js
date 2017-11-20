'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRequest = handleRequest;
exports.extractFromReq = extractFromReq;

var _log = require('../log');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('Server');

/**
 * Wrapper for the request handler. It creates the appropiate response object and catches errors. For example:
 *     app.post('/api/path', handleRequest(async (req, res) => {
 *        const param = extractFromReq(req, 'param')
 *        return 'Success'
 *    }))
 * @param  {function} callback - Actual handler, the return value will be used as response to the client. It will receive (req, res) as parameters
 * @return {function} - Wrapper function
 */
function handleRequest(callback) {
  var _this = this;

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var data, _data, message;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              log.info('Handling request to', req.path);

              _context.prev = 1;
              _context.next = 4;
              return callback(req, res);

            case 4:
              data = _context.sent;
              return _context.abrupt('return', res.json(sendOk(data)));

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](1);

              log.error('Error handling request', req.path, _context.t0);

              _data = _context.t0.data || {};
              message = _context.t0.message;
              return _context.abrupt('return', res.json(sendError(_data, message)));

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[1, 8]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}

/**
 * Get a named parameter from a request object. It leverages GET and POST requests and parses JSON objects
 * @param  {object} req   - Express js request object. Check {@link https://expressjs.com} for more info.
 * @param  {string} param - Searched param
 * @return {object} - The param value, it throws if it's not present
 */
function extractFromReq(req, param) {
  var value = null;

  if (req.query[param]) {
    value = req.query[param];
  } else if (req.body[param]) {
    value = req.body[param];
  } else if (req.params[param]) {
    value = req.params[param];
  }

  if (req.headers['content-type'] === 'application/json') {
    value = JSON.parse(value);
  }

  if (!value) {
    throw new Error('Could not get ' + param + ' from request');
  }

  return value;
}

function sendOk(data) {
  return { ok: true, data: data };
}

function sendError(data, error) {
  return { ok: false, data: data, error: error };
}