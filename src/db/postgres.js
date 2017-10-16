import pg from 'pg'
import { getObjectValues } from '../utils'


/**
 * Client to query Postgres. Uses `pg` behind the scenes, {@link https://node-postgres.com/}
 * @namespace
 */
const postgres = {
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
   * Forward queries to the pg client
   * @param  {...args} args - {@link https://node-postgres.com/} for more info
   * @return {Promise<object>} - Object containing the matched rows
   */
  query(...args) {
    return this.client.query(...args)
  },

  /**
   * Counts rows from a query result
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. @see getOrderValues
   * @return {Promise<array>} - Rows
   */
  count(tableName, conditions, orderBy) {
    return this._query('COUNT', tableName, conditions, orderBy)
  },

  /**
   * Select rows from a table
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. @see getOrderValues
   * @return {Promise<array>} - Rows
   */
  select(tableName, conditions, orderBy) {
    return this._query('SELECT', tableName, conditions, orderBy)
  },

  /**
   * Select the first row that matches
   * @param  {string} tableName
   * @param  {object} [conditions] - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @param  {object} [orderBy]    - An object describing the ORDER BY clause. The properties should be the column names and it's values the order value. @see getOrderValues
   * @return {Promise<object>} - Row
   */
  async selectOne(tableName, conditions, orderBy) {
    const rows = await this._query('SELECT', tableName, conditions, orderBy, 'LIMIT 1')
    return rows[0]
  },

  // Internal
  async _query(method, tableName, conditions=false, orderBy=false, extra) {
    let values = []
    let where = ''
    let order = ''

    if (conditions) {
      values = getObjectValues(conditions)
      where = `WHERE ${this.toAssignmentFields(conditions).join(' AND ')}`
    }

    if (order) {
      order = `ORDER BY ${this.getOrderValues(order)}`
    }

    const result = await this.client.query(`${method} * FROM ${tableName} ${where} ${order} ${extra}`, values)

    return result.rows
  },

  /**
   * upsert an object to the desired collection.
   * It adds the `createdAt` and `updatedAt` properties by default
   * @param  {string} collectionName - Collection name
   * @param  {string} _id            - _id of the new object or of the one to update
   * @param  {object} [row]          - properties to upsert
   * @return {object}
   */

  /**
   * Insert an object on the database. Ex:
   *   insert('users', { name: 'Name', avatar: 'image.png' }) => INSERT INTO users ("name", "avatar") VALUES ('Name', 'image.png')
   * @param  {string} tableName
   * @param  {object} changes   - An object describing the insertion. The properties should be the column names and it's values the value to insert
   * @return {Promise<object>}
   */
  async insert(tableName, changes) {
    if (! changes) throw new Error(`Tried to perform an insert on ${tableName} without any values. Supply a changes object`)

    changes.createdAt = changes.createdAt || new Date()
    changes.updatedAt = changes.updatedAt || new Date()

    const values = getObjectValues(changes)

    return await this.client.query(`INSERT INTO ${tableName}(
      ${this.toColumnFields(changes)}
    ) VALUES(
      ${this.toValuePlaceholders(changes)}
    )`, values)
  },


  /**
   * Update an object on the database. Ex:
   *   update('users', { name: 'New Name' }, { id: 22 }) => UPDATE users SET "name"='New Name' WHERE "id"=22
   * @param  {string} tableName
   * @param  {object} changes    - An object describing the updates. The properties should be the column names and it's values the value to update.
   * @param  {object} conditions - An object describing the WHERE clause. The properties should be the column names and it's values the condition value.
   * @return {Promise<object>}
   */
  async update(tableName, changes, conditions) {
    if (! changes) throw new Error(`Tried to update ${tableName} without any values. Supply a changes object`)
    if (! conditions) throw new Error(`Tried to update ${tableName} without a WHERE clause. Supply a conditions object`)

    changes.updatedAt = changes.updatedAt || new Date()

    const changeValues    = getObjectValues(changes)
    const conditionValues = getObjectValues(conditions)

    const values = changeValues.concat(conditionValues)

    return await this.client.query(`UPDATE ${tableName}
      SET ${this.toAssignmentFields(changes)}
      WHERE ${this.toAssignmentFields(conditions, changeValues.length).join(' AND ')}
    `, values)
  },

  async deleteFrom(tableName, conditions) {
    if (! conditions) throw new Error(`Tried to update ${tableName} without a WHERE clause. Supply a conditions object`)
    const values = getObjectValues(conditions)

    return await this.client.query(`DELETE FROM ${tableName}
      WHERE ${this.toAssignmentFields(conditions).join(' AND ')}
    `, values)
  },

  /**
   * Creates a table with the desired rows if it doesn't exist.
   * Adds:
   *   - `createdAt` and `updatedAt` columns by default
   *   - A secuence with the table name to use as autoincrement id
   * Ex:
   *   this.createTable('users', `
   *     "id" int NOT NULL DEFAULT nextval('users_id_seq'),
   *     "name" varchar(42) NOT NULL
   *   `)
   * @param  {string} tableName
   * @param  {string} rows    - Each desired row to create
   * @param  {object} options - Options controling the behaviour of createTable
   * @param  {string} [options.sequenceName=`${tableName}_id_seq`] - Override the default sequence name. The sequenceName is a falsy value, the sequence will be skipped
   * @param  {string} [options.primaryKey="id"]                    - Override the default primary key.
   * @return {Promise}
   */
  async createTable(tableName, rows, { sequenceName = `${tableName}_id_seq`, primaryKey = 'id' } = {}) {
    if (sequenceName) await this.createSequence(sequenceName)

    await this.client.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (
      ${rows},
      "createdAt" timestamp NOT NULL,
      "updatedAt" timestamp,
      PRIMARY KEY ("${primaryKey}")
    );`)

    if (sequenceName) await this.alterSequenceOwnership(sequenceName, tableName)
  },

  /**
   * Creates a sequence if it doesn't exist
   * @param  {string} name
   * @return {Promise}
   */
  async createSequence(name) {
    try {
      return await this.client.query(`CREATE SEQUENCE ${name};`)
    } catch(e) {
      // CREATE SEQUENCE IF NOT EXISTS is on PG9.5
      // If this fails it means that the sequence exists
    }
  },

  alterSequenceOwnership(name, owner, columnName = 'id') {
    return this.client.query(`ALTER SEQUENCE ${name} OWNED BY ${owner}.${columnName};`)
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
    return columnNames.map((column, index) => `"${column}" = $${index + start + 1}`)
  },

  /*
   * From an map of { column1 => int, column2 => string } to an array containing
   *  ['$1', '$2', (...)]
   * The index from which to start the placeholders is configurable
   * @param {object} columns   - Each column as a property of the object
   * @param {number} [start=0] - Start index for each placeholder
   * @return {array}
   */
  toValuePlaceholders(columns, start=0) {
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
  }
}

module.exports = postgres
