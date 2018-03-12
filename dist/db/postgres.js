'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postgres = undefined;

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Client to query Postgres. Uses `pg` behind the scenes. Check {@link https://node-postgres.com/} for more info.
 * @namespace
 */
var postgres = exports.postgres = {
  client: null, // defined in `.connect()`

  /**
   * Connect to the Postgres database
   * @param  {string} connectionString
   * @return {Promise}
   */
  connect: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(connectionString) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.client = new _pg2.default.Client(connectionString);

              _context.next = 3;
              return this.client.connect();

            case 3:
              return _context.abrupt('return', this.client);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function connect(_x) {
      return _ref.apply(this, arguments);
    }

    return connect;
  }(),


  /**
   * Forward queries to the pg client. Check {@link https://node-postgres.com/} for more info.
   * @param  {string} queryString
   * @param  {array} [values]
   * @return {Promise<array>} - Array containing the matched rows
   */
  query: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(queryString, values) {
      var result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.client.query(queryString, values);

            case 2:
              result = _context2.sent;
              return _context2.abrupt('return', result.rows);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function query(_x2, _x3) {
      return _ref2.apply(this, arguments);
    }

    return query;
  }(),


  /**
   * Counts rows from a query result
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {string} [extra]      - String appended at the end of the query
   * @return {Promise<array>} - Rows
   */
  count: function count(tableName, conditions, extra) {
    return this._query('SELECT COUNT(*)', tableName, conditions, null, extra);
  },


  /**
   * Select rows from a table
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. See {@link postgres#getOrderValues}
   * @param  {string} [extra]      - String appended at the end of the query
   * @return {Promise<array>} - Rows
   */
  select: function select(tableName, conditions, orderBy, extra) {
    return this._query('SELECT *', tableName, conditions, orderBy, extra);
  },


  /**
   * Select the first row that matches
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. See {@link postgres#getOrderValues}
   * @return {Promise<object>} - Row
   */
  selectOne: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tableName, conditions, orderBy) {
      var rows;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this._query('SELECT *', tableName, conditions, orderBy, 'LIMIT 1');

            case 2:
              rows = _context3.sent;
              return _context3.abrupt('return', rows[0]);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function selectOne(_x4, _x5, _x6) {
      return _ref3.apply(this, arguments);
    }

    return selectOne;
  }(),


  // Internal
  _query: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(method, tableName, conditions, orderBy) {
      var extra = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
      var values, where, order, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              values = [];
              where = '';
              order = '';


              if (conditions) {
                values = Object.values(conditions);
                where = 'WHERE ' + this.toAssignmentFields(conditions).join(' AND ');
              }

              if (orderBy) {
                order = 'ORDER BY ' + this.getOrderValues(orderBy);
              }

              _context4.next = 7;
              return this.client.query(method + ' FROM ' + tableName + ' ' + where + ' ' + order + ' ' + extra, values);

            case 7:
              result = _context4.sent;
              return _context4.abrupt('return', result.rows);

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function _query(_x8, _x9, _x10, _x11) {
      return _ref4.apply(this, arguments);
    }

    return _query;
  }(),


  /**
   * Insert an object on the database.
   * @example
   * insert('users', { name: 'Name', avatar: 'image.png' }) => INSERT INTO users ("name", "avatar") VALUES ('Name', 'image.png')
   * @param  {string} tableName
   * @param  {object} changes           - An object describing the insertion. The properties should be the column names and it's values the value to insert
   * @param  {string} [primaryKey='id'] - Which primary key return upon insertion
   * @return {Promise<object>}
   */
  insert: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(tableName, changes) {
      var primaryKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';
      var values;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (changes) {
                _context5.next = 2;
                break;
              }

              throw new Error('Tried to perform an insert on ' + tableName + ' without any values. Supply a changes object');

            case 2:

              changes.created_at = changes.created_at || new Date();
              changes.updated_at = changes.updated_at || new Date();

              values = Object.values(changes);
              _context5.next = 7;
              return this.client.query('INSERT INTO ' + tableName + '(\n      ' + this.toColumnFields(changes) + '\n    ) VALUES(\n      ' + this.toValuePlaceholders(changes) + '\n    ) RETURNING ' + primaryKey, values);

            case 7:
              return _context5.abrupt('return', _context5.sent);

            case 8:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function insert(_x13, _x14) {
      return _ref5.apply(this, arguments);
    }

    return insert;
  }(),


  /**
   * Update an object on the database.
   * @example
   * update('users', { name: 'New Name' }, { id: 22 }) => UPDATE users SET "name"='New Name' WHERE "id"=22
   * @param  {string} tableName
   * @param  {object} changes    - An object describing the updates. The properties should be the column names and it's values the value to update.
   * @param  {object} conditions - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @return {Promise<object>}
   */
  update: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(tableName, changes, conditions) {
      var changeValues, conditionValues, whereClauses, values;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (changes) {
                _context6.next = 2;
                break;
              }

              throw new Error('Tried to update ' + tableName + ' without any values. Supply a changes object');

            case 2:
              if (conditions) {
                _context6.next = 4;
                break;
              }

              throw new Error('Tried to update ' + tableName + ' without a WHERE clause. Supply a conditions object');

            case 4:

              changes.updated_at = changes.updated_at || new Date();

              changeValues = Object.values(changes);
              conditionValues = Object.values(conditions);
              whereClauses = this.toAssignmentFields(conditions, changeValues.length);
              values = changeValues.concat(conditionValues);
              _context6.next = 11;
              return this.client.query('UPDATE ' + tableName + '\n      SET   ' + this.toAssignmentFields(changes) + '\n      WHERE ' + whereClauses.join(' AND '), values);

            case 11:
              return _context6.abrupt('return', _context6.sent);

            case 12:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function update(_x15, _x16, _x17) {
      return _ref6.apply(this, arguments);
    }

    return update;
  }(),


  /**
   * Delete rows from the database
   * @param  {string} tableName
   * @param  {object} conditions - An object describing the WHERE clause.
   * @return {Promise<object>}
   */
  delete: function _delete(tableName, conditions) {
    if (!conditions) {
      throw new Error('Tried to update ' + tableName + ' without a WHERE clause. Supply a conditions object');
    }

    var values = Object.values(conditions);

    return this.client.query('DELETE FROM ' + tableName + '\n      WHERE ' + this.toAssignmentFields(conditions).join(' AND '), values);
  },


  /**
   * Creates a table with the desired rows if it doesn't exist.
   * Adds:
   *   - `created_at` and `updated_at` columns by default
   *   - A secuence with the table name to use as autoincrement id
   * @example
   * this.createTable('users', `
   *   "id" int NOT NULL DEFAULT nextval('users_id_seq'),
   *   "name" varchar(42) NOT NULL
   * `)
   * @param  {string} tableName
   * @param  {string} rows    - Each desired row to create
   * @param  {object} options - Options controling the behaviour of createTable
   * @param  {string} [options.sequenceName=`${tableName}_id_seq`] - Override the default sequence name. The sequenceName is a falsy value, the sequence will be skipped
   * @param  {string} [options.primaryKey="id"]                    - Override the default primary key.
   * @return {Promise}
   */
  createTable: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(tableName, rows) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _options$sequenceName, sequenceName, _options$primaryKey, primaryKey;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _options$sequenceName = options.sequenceName, sequenceName = _options$sequenceName === undefined ? tableName + '_id_seq' : _options$sequenceName, _options$primaryKey = options.primaryKey, primaryKey = _options$primaryKey === undefined ? 'id' : _options$primaryKey;

              if (!sequenceName) {
                _context7.next = 4;
                break;
              }

              _context7.next = 4;
              return this.createSequence(sequenceName);

            case 4:
              _context7.next = 6;
              return this.client.query('CREATE TABLE IF NOT EXISTS "' + tableName + '" (\n      ' + rows + ',\n      "created_at" timestamp NOT NULL,\n      "updated_at" timestamp,\n      PRIMARY KEY ("' + primaryKey + '")\n    );');

            case 6:
              if (!sequenceName) {
                _context7.next = 9;
                break;
              }

              _context7.next = 9;
              return this.alterSequenceOwnership(sequenceName, tableName);

            case 9:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function createTable(_x19, _x20) {
      return _ref7.apply(this, arguments);
    }

    return createTable;
  }(),


  /**
   * Creates an index if it doesn't exist
   * @param  {string} tableName
   * @param  {string} name of the index
   * @param  {object} extra conditions for the index
   * @return {Promise}
   */
  createIndex: function createIndex(tableName, name, fields) {
    var conditions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var unique = conditions.unique;


    unique = unique === true ? 'UNIQUE' : '';

    return this.client.query('CREATE ' + unique + ' INDEX IF NOT EXISTS ' + name + ' ON ' + tableName + ' (' + fields.join(',') + ')');
  },


  /**
   * Creates a sequence if it doesn't exist
   * @param  {string} name
   * @return {Promise}
   */
  createSequence: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(name) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return this.client.query('CREATE SEQUENCE ' + name + ';');

            case 3:
              return _context8.abrupt('return', _context8.sent);

            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8['catch'](0);

            case 8:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this, [[0, 6]]);
    }));

    function createSequence(_x22) {
      return _ref8.apply(this, arguments);
    }

    return createSequence;
  }(),
  alterSequenceOwnership: function alterSequenceOwnership(name, owner) {
    var columnName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    return this.client.query('ALTER SEQUENCE ' + name + ' OWNED BY ' + owner + '.' + columnName + ';');
  },


  /**
   * Truncates the table provided
   * @param  {string} tableName
   * @return {Promise} Query result
   */
  truncate: function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(tableName) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.client.query('TRUNCATE ' + tableName + ' RESTART IDENTITY;');

            case 2:
              return _context9.abrupt('return', _context9.sent);

            case 3:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function truncate(_x24) {
      return _ref9.apply(this, arguments);
    }

    return truncate;
  }(),


  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *   ['"column1"', '"column2"', (...)]
   * @param {object} columns - Each column as a property of the object
   * @return {array}
   */
  toColumnFields: function toColumnFields(columns) {
    var columnNames = Object.keys(columns);
    return columnNames.map(JSON.stringify).join(', ');
  },


  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *   ['"column1" = $1', '"column2" = $2', (...)]
   * The index from which to start the placeholders is configurable
   * @param {object} columns   - Each column as a property of the object
   * @param {number} [start=0] - Start index for each placeholder
   * @return {array}
   */
  toAssignmentFields: function toAssignmentFields(columns) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var columnNames = Object.keys(columns);
    return columnNames.map(function (column, index) {
      return '"' + column + '" = $' + (index + start + 1);
    });
  },


  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *  ['$1', '$2', (...)]
   * The index from which to start the placeholders is configurable
   * @param {object} columns   - Each column as a property of the object
   * @param {number} [start=0] - Start index for each placeholder
   * @return {array}
   */
  toValuePlaceholders: function toValuePlaceholders(columns) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var columnNames = Object.keys(columns);
    return columnNames.map(function (_, index) {
      return '$' + (index + start + 1);
    });
  },


  /*
   * From an map of { column1 => DESC/ASC, column2 => DESC/ASC } to an array containing
   *  ['column1 DESC/ASC, 'column2 DESC/ASC', (...)]
   * @param {object} columns - Each column as a property of the object, the values represent the desired order
   * @return {array}
   */
  getOrderValues: function getOrderValues(order) {
    return Object.keys(order).map(function (column) {
      return '"' + column + '" ' + order[column];
    });
  },


  /**
   * Close db connection
   * @return {Promise}
   */
  close: function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.client.end();

            case 2:
              return _context10.abrupt('return', _context10.sent);

            case 3:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function close() {
      return _ref10.apply(this, arguments);
    }

    return close;
  }()
};