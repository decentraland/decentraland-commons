import pg from 'pg'

import { getObjectValues } from '../utils'

/**
 * Client to query Postgres. Uses `pg` behind the scenes. Check {@link https://node-postgres.com/} for more info.
 * @namespace
 */
export const postgres = {
  client: null, // defined in `.connect()`

  /**
   * Connect to the Postgres database
   * @param  {string} connectionString
   * @return {Promise}
   */
  async connect(connectionString) {
    this.client = new pg.Client(connectionString)

    await this.client.connect()

    return this.client
  },

  /**
   * Forward queries to the pg client. Check {@link https://node-postgres.com/} for more info.
   * @param  {string} queryString
   * @param  {array} [values]
   * @return {Promise<object>} - Object containing the matched rows
   */
  async query(queryString, values) {
    const result = await this.client.query(queryString, values)
    return result.rows
  },

  /**
   * Counts rows from a query result
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. See {@link postgres#getOrderValues}
   * @return {Promise<array>} - Rows
   */
  count(tableName, conditions, orderBy) {
    return this._query('COUNT', tableName, conditions, orderBy)
  },

  /**
   * Select rows from a table
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. See {@link postgres#getOrderValues}
   * @return {Promise<array>} - Rows
   */
  select(tableName, conditions, orderBy) {
    return this._query('SELECT', tableName, conditions, orderBy)
  },

  /**
   * Select the first row that matches
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. See {@link postgres#getOrderValues}
   * @return {Promise<object>} - Row
   */
  async selectOne(tableName, conditions, orderBy) {
    const rows = await this._query(
      'SELECT',
      tableName,
      conditions,
      orderBy,
      'LIMIT 1'
    )

    return rows[0]
  },

  // Internal
  async _query(method, tableName, conditions, orderBy, extra = '') {
    let values = []
    let where = ''
    let order = ''

    if (conditions) {
      values = getObjectValues(conditions)
      where = `WHERE ${this.toAssignmentFields(conditions).join(' AND ')}`
    }

    if (orderBy) {
      order = `ORDER BY ${this.getOrderValues(orderBy)}`
    }

    const result = await this.client.query(
      `${method} * FROM ${tableName} ${where} ${order} ${extra}`,
      values
    )

    return result.rows
  },

  /**
   * Insert an object on the database.
   * @example
   * insert('users', { name: 'Name', avatar: 'image.png' }) => INSERT INTO users ("name", "avatar") VALUES ('Name', 'image.png')
   * @param  {string} tableName
   * @param  {object} changes   - An object describing the insertion. The properties should be the column names and it's values the value to insert
   * @return {Promise<object>}
   */
  async insert(tableName, changes) {
    if (!changes) {
      throw new Error(
        `Tried to perform an insert on ${tableName} without any values. Supply a changes object`
      )
    }

    changes.created_at = changes.created_at || new Date()
    changes.updated_at = changes.updated_at || new Date()

    const values = getObjectValues(changes)

    return await this.client.query(
      `INSERT INTO ${tableName}(
      ${this.toColumnFields(changes)}
    ) VALUES(
      ${this.toValuePlaceholders(changes)}
    ) RETURNING id`,
      values
    )
  },

  /**
   * Update an object on the database.
   * @example
   * update('users', { name: 'New Name' }, { id: 22 }) => UPDATE users SET "name"='New Name' WHERE "id"=22
   * @param  {string} tableName
   * @param  {object} changes    - An object describing the updates. The properties should be the column names and it's values the value to update.
   * @param  {object} conditions - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @return {Promise<object>}
   */
  async update(tableName, changes, conditions) {
    if (!changes) {
      throw new Error(
        `Tried to update ${tableName} without any values. Supply a changes object`
      )
    }
    if (!conditions) {
      throw new Error(
        `Tried to update ${tableName} without a WHERE clause. Supply a conditions object`
      )
    }

    changes.updated_at = changes.updated_at || new Date()

    const changeValues = getObjectValues(changes)
    const conditionValues = getObjectValues(conditions)

    const whereClauses = this.toAssignmentFields(
      conditions,
      changeValues.length
    )

    const values = changeValues.concat(conditionValues)

    return await this.client.query(
      `UPDATE ${tableName}
      SET   ${this.toAssignmentFields(changes)}
      WHERE ${whereClauses.join(' AND ')}`,
      values
    )
  },

  /**
   * Delete rows from the database
   * @param  {string} tableName
   * @param  {object} conditions - An object describing the WHERE clause.
   * @return {Promise<object>}
   */
  delete(tableName, conditions) {
    if (!conditions) {
      throw new Error(
        `Tried to update ${tableName} without a WHERE clause. Supply a conditions object`
      )
    }

    const values = getObjectValues(conditions)

    return this.client.query(
      `DELETE FROM ${tableName}
      WHERE ${this.toAssignmentFields(conditions).join(' AND ')}`,
      values
    )
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
  async createTable(tableName, rows, options = {}) {
    const { sequenceName = `${tableName}_id_seq`, primaryKey = 'id' } = options

    if (sequenceName) await this.createSequence(sequenceName)

    await this.client.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (
      ${rows},
      "created_at" timestamp NOT NULL,
      "updated_at" timestamp,
      PRIMARY KEY ("${primaryKey}")
    );`)

    if (sequenceName) await this.alterSequenceOwnership(sequenceName, tableName)
  },

  /**
   * Creates an index if it doesn't exist
   * @param  {string} tableName
   * @param  {string} name of the index
   * @param  {object} extra conditions for the index
   * @return {Promise}
   */
  createIndex(tableName, name, fields, conditions = {}) {
    let { unique } = conditions

    unique = unique === true ? 'UNIQUE' : ''

    return this.client.query(
      `CREATE ${unique} INDEX IF NOT EXISTS ${name} ON ${tableName} (${fields.join(
        ','
      )})`
    )
  },

  /**
   * Creates a sequence if it doesn't exist
   * @param  {string} name
   * @return {Promise}
   */
  async createSequence(name) {
    try {
      return await this.client.query(`CREATE SEQUENCE ${name};`)
    } catch (e) {
      // CREATE SEQUENCE IF NOT EXISTS is on PG9.5
      // If this fails it means that the sequence exists
    }
  },

  alterSequenceOwnership(name, owner, columnName = 'id') {
    return this.client.query(
      `ALTER SEQUENCE ${name} OWNED BY ${owner}.${columnName};`
    )
  },

  /**
   * Truncates the table provided
   * @param  {string} tableName
   * @return {Promise} Query result
   */
  async truncate(tableName) {
    return await this.client.query(`TRUNCATE ${tableName} RESTART IDENTITY;`)
  },

  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *   ['"column1"', '"column2"', (...)]
   * @param {object} columns - Each column as a property of the object
   * @return {array}
   */
  toColumnFields(columns) {
    const columnNames = Object.keys(columns)
    return columnNames.map(JSON.stringify).join(', ')
  },

  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *   ['"column1" = $1', '"column2" = $2', (...)]
   * The index from which to start the placeholders is configurable
   * @param {object} columns   - Each column as a property of the object
   * @param {number} [start=0] - Start index for each placeholder
   * @return {array}
   */
  toAssignmentFields(columns, start = 0) {
    const columnNames = Object.keys(columns)
    return columnNames.map(
      (column, index) => `"${column}" = $${index + start + 1}`
    )
  },

  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *  ['$1', '$2', (...)]
   * The index from which to start the placeholders is configurable
   * @param {object} columns   - Each column as a property of the object
   * @param {number} [start=0] - Start index for each placeholder
   * @return {array}
   */
  toValuePlaceholders(columns, start = 0) {
    const columnNames = Object.keys(columns)
    return columnNames.map((_, index) => `$${index + start + 1}`)
  },

  /*
   * From an map of { column1 => DESC/ASC, column2 => DESC/ASC } to an array containing
   *  ['column1 DESC/ASC, 'column2 DESC/ASC', (...)]
   * @param {object} columns - Each column as a property of the object, the values represent the desired order
   * @return {array}
   */
  getOrderValues(order) {
    return Object.keys(order).map(column => `"${column}" ${order[column]}`)
  },

  /**
   * Close db connection
   * @return {Promise}
   */
  async close() {
    return await this.client.end()
  }
}
