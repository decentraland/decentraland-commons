'use strict';

var _mongodb = require('mongodb');

var _log = require('../log');

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = new _log.Log('MongoDB');

/**
 * Client to query MongoDB. Uses `mongodb` behind the scenes. Check {@link https://docs.mongodb.com/getting-started/node/client/} for more info.
 * IMPORTANT: To use this client with the `Model` class, it should be updated to follow the common API found on `postgres.js`
 * @namespace
 */
var mongo = {
  client: null, // Defined on `.connect()`

  /**
   * Connect to the Mongo database
   * @param  {number} port
   * @param  {string} dbname
   * @param  {string} [username]
   * @param  {string} [password]
   * @return {Promise} - Resolves on connection
   */
  connect: function connect(port, dbname, username, password) {
    var _this = this;

    var url = 'mongodb://localhost:' + port + '/' + dbname;

    log.info('Connecting to ' + url);

    return _mongodb.MongoClient.connect(url).then(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mongodb) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                log.info('Connected to MongoDB ' + dbname);

                if (!username) {
                  _context.next = 4;
                  break;
                }

                _context.next = 4;
                return (0, _utils.promisify)(mongodb.authenticate, mongodb)(username, password);

              case 4:

                _this.client = mongodb;

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()).catch(function (error) {
      error.connectionTimedOut = _this.isConnectionTimedOut(error);

      if (error.connectionTimedOut) {
        log.warn('Connection to MongoDB ' + dbname + ' TIMED OUT');
      }

      return Promise.reject(error);
    });
  },

  isConnectionTimedOut: function isConnectionTimedOut(error) {
    // Sadly as of this writing, there's no other way to check if a mongo connection timed out
    return error.message.search(/timed out$/) !== -1;
  },

  /**
   * Forward to the MongoDB collection method
   * @param  {string} collectionName - Collection name, check the [mongodb docs]{@link https://docs.mongodb.com/getting-started/node/client/} for more info.
   * @return {object} - queriable collection
   */
  collection: function collection(collectionName) {
    return this.client.collection(collectionName);
  },


  /**
   * Upsert an object to the desired collection.
   * It adds the `createdAt` and `updatedAt` properties by default
   * @param  {string} collectionName - Collection name
   * @param  {string} _id            - _id of the new object or of the one to update
   * @param  {object} [row]          - properties to upsert
   * @return {Promise<object>}
   */
  save: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(collectionName, _id) {
      var row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var collection, exists;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              collection = this.client.collection(collectionName);
              _context2.next = 3;
              return this.exists(collectionName, { _id: _id });

            case 3:
              exists = _context2.sent;

              if (!(exists && !row)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt('return');

            case 6:
              if (!exists) {
                _context2.next = 13;
                break;
              }

              row.updatedAt = new Date();
              _context2.next = 10;
              return collection.update({ _id: _id }, { $set: row });

            case 10:
              return _context2.abrupt('return', _context2.sent);

            case 13:
              row = Object.assign({ _id: _id, createdAt: new Date() }, row);
              _context2.next = 16;
              return collection.insertOne(row);

            case 16:
              return _context2.abrupt('return', _context2.sent);

            case 17:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function save(_x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return save;
  }(),


  /**
   * Checks if a certain `query` returns any result
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<boolean>}
   */
  exists: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(collectionName) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var count;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.client.collection(collectionName).find(query).count();

            case 2:
              count = _context3.sent;
              return _context3.abrupt('return', count > 0);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function exists(_x6) {
      return _ref3.apply(this, arguments);
    }

    return exists;
  }(),


  /**
   * Find objects on a collection
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<array<object>>}
   */
  find: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(collectionName, query) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (this.client) {
                _context4.next = 2;
                break;
              }

              throw new Error('Connection to database not found, have you called `.connect()` already?');

            case 2:
              _context4.next = 4;
              return this.client.collection(collectionName).find(query).toArray();

            case 4:
              return _context4.abrupt('return', _context4.sent);

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function find(_x7, _x8) {
      return _ref4.apply(this, arguments);
    }

    return find;
  }(),


  /**
   * Find the first match for a query
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<object>}
   */
  findOne: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(collectionName, query) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (this.client) {
                _context5.next = 2;
                break;
              }

              throw new Error('Connection to database not found, have you called `.connect()` already?');

            case 2:
              _context5.next = 4;
              return this.client.collection(collectionName).findOne(query);

            case 4:
              return _context5.abrupt('return', _context5.sent);

            case 5:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function findOne(_x9, _x10) {
      return _ref5.apply(this, arguments);
    }

    return findOne;
  }(),


  /**
   * Forward aggregate to MongoDB
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<object>}
   */
  aggregate: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(collectionName, query) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (this.client) {
                _context6.next = 2;
                break;
              }

              throw new Error('Connection to database not found, have you called `.connect()` already?');

            case 2:
              _context6.next = 4;
              return this.client.collection(collectionName).aggregate(query).toArray();

            case 4:
              return _context6.abrupt('return', _context6.sent);

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function aggregate(_x11, _x12) {
      return _ref6.apply(this, arguments);
    }

    return aggregate;
  }(),


  /**
   * Close the db connection
   */
  close: function close() {
    if (this.client) {
      this.client.close();
    }
  }
};

module.exports = mongo;