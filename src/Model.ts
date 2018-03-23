import * as dbClients from './db'
import * as utils from './utils'
import { OrderBy, Conditions } from './db/postgres'

/**
 * Basic Model class for accesing inner attributes easily
 */
export class Model {
  tableName = null
  columnNames = []
  primaryKey = 'id'

  /**
   * DB client to use. We use Postgres by default. Can be changed via Model.useDB('db client')
   * It's the same for
   * @type {object}
   */
  db = dbClients['postgres']

  /**
   * Change the current DB client
   * @param {string|object} dbClient - The name of an available db client (from /db) or an object with the same API
   */
  setDb(dbClient: keyof typeof dbClients = 'postgres') {
    if (typeof dbClient === 'string' && !dbClients[dbClient]) {
      throw new Error(`Undefined db client ${dbClient}`)
    }

    this.db = dbClients[dbClient] as any
  }

  /**
   * Return the rows that match the conditions
   * @param  {object} [conditions] - It returns all rows if empty
   * @param  {object} [orderBy]    - Object describing the column ordering
   * @param  {string} [extra]      - String appended at the end of the query
   * @return {Promise<array>}
   */
  async find(conditions, orderBy: OrderBy, extra: string) {
    return await this.db.select(this.tableName, conditions, orderBy, extra)
  }

  /**
   * Return the row for the supplied primaryKey or condition object
   * @param  {string|number|object} primaryKeyOrCond - If the argument is an object it uses it for the conditions. Otherwise it'll use it as the searched primaryKey.
   * @return {Promise<object>}
   */
  async findOne(primaryKeyOrCond: string | number | object, orderBy?: OrderBy) {
    const conditions =
      typeof primaryKeyOrCond === 'object'
        ? primaryKeyOrCond
        : { [this.primaryKey]: primaryKeyOrCond }

    return await this.db.selectOne(this.tableName, conditions, orderBy)
  }

  /**
   * Count the rows for the table
   * @param  {object} [conditions] - It returns all rows if empty
   * @param  {string} [extra]      - String appended at the end of the query
   * @return {Promise<integer>}
   */
  async count(conditions, extra) {
    const result = await this.db.count(this.tableName, conditions, extra)
    return result.length ? parseInt(result[0].count, 10) : 0
  }

  /**
   * Forward queries to the db client
   * @param  {string} queryString
   * @param  {array} [values]
   * @return {Promise<array>} - Array containing the matched rows
   */
  async query(queryString, values) {
    return await this.db.query(queryString, values)
  }

  /**
   * Insert the row filtering the Model.columnNames to the Model.tableName table
   * @param  {object} row
   * @return {Promise<object>} the row argument with the inserted primaryKey
   */
  private async _insert(row) {
    const insertion = await this.db.insert(
      this.tableName,
      utils.pick(row, this.columnNames),
      this.primaryKey
    )
    row[this.primaryKey] = insertion.rows[0][this.primaryKey]
    return row
  }

  /**
   * Update the row on the Model.tableName table.
   * @param  {object} changes    - An object describing the updates.
   * @param  {object} conditions - An object describing the WHERE clause.
   * @return {Promise<object>}
   */
  private async _update(changes, conditions) {
    return await this.db.update(
      this.tableName,
      utils.pick(changes, this.columnNames),
      conditions
    )
  }

  /**
   * Delete the row on the Model.tableName table.
   * @param  {object} conditions - An object describing the WHERE clause.
   * @return {Promise<object>}
   */
  private _delete(conditions: Conditions) {
    return this.db.delete(this.tableName, conditions)
  }

  /**
   * Checks to see if all column names exist on the attributes object.
   * If you need a more complex approach (skipping NULLABLE columns for example) you can override it.
   * @param  {object}  attributes - Model attributes to check
   * @return {boolean} true if at least one of the properties don't exist on the object
   */
  isIncomplete(attributes) {
    return this.columnNames.some(column => !attributes.hasOwnProperty(column))
  }

  /**
   * Creates a new instance storing the attributes for later use
   * @param  {object} attributes
   * @return {Model<instance>}
   */
  constructor(public attributes = {}) {}

  /**
   * Return the row for the this.attributes primaryKey property, forwards to Model.findOne
   * @return {Promise<object>}
   */
  async retreive() {
    const primaryKey = this.attributes[this.primaryKey]
    this.attributes = await this.findOne(primaryKey)
    return this.attributes
  }

  /**
   * Forwards to Mode.insert using this.attributes
   */
  async insert() {
    return await this._insert(this.attributes)
  }

  /**
   * Forwards to Mode.update using this.attributes. If no conditions are supplied, it uses this.attributes[primaryKey]
   * @params {object} [conditions={ primaryKey: this.attributes[primaryKey] }]
   */
  async update(conditions) {
    if (!conditions) {
      const primaryKey = this.primaryKey
      conditions = { [primaryKey]: this.attributes[primaryKey] }
    }
    return await this._update(this.attributes, conditions)
  }

  /**
   * Forwards to Mode.delete using this.attributes. If no conditions are supplied, it uses this.attributes[primaryKey]
   * @params {object} [conditions={ primaryKey: this.attributes[primaryKey] }]
   */
  async delete(conditions) {
    if (!conditions) {
      const primaryKey = this.primaryKey
      conditions = { [primaryKey]: this.attributes[primaryKey] }
    }
    return await this._delete(conditions)
  }

  /**
   * Returns true if the `attributes` property evaluates to false
   * @return {boolean}
   */
  isEmpty() {
    return !this.get()
  }

  /**
   * Get a value for a given property name
   * @param  {string} [key] - Key on the attributes object. If falsy, it'll return the full attributes object
   * @return {object} Value found, if any
   */
  get(key?: string) {
    return key ? this.attributes[key] : this.attributes
  }

  /**
   * Get a nested attribute for an object. Inspired on [immutable js getIn]{@link https://facebook.github.io/immutable-js/docs/#/Map/getIn}
   * @param  {array} keyPath - Path of keys to follow
   * @return {object} The value of the searched key or null if any key is missing along the way
   */
  getIn(keyPath: string[]) {
    let value = this.attributes

    for (let prop of keyPath) {
      if (!value) return null
      value = value[prop]
    }

    return value
  }

  /**
   * Set a top level key with a value
   * @param {string} key
   * @param {object} value
   * @return {Model<instace>} The instance of the model (chainable)
   */
  set(key: string, value: any) {
    this.attributes[key] = value
    return this
  }

  /**
   * Set a nested attribute for an object. It shortcircuits if any key is missing. Inspired on [immutable js setIn]{@link https://facebook.github.io/immutable-js/docs/#/Map/setIn}
   * @param  {array} keyPath - Path of keys
   * @param  {object} value  - Value to set
   * @return {Model<instace>} The instance of the model (chainable)
   */
  setIn(keyPath: string[], value: any) {
    let keyAmount = keyPath.length
    let nested = this.attributes

    for (let i = 0; i < keyAmount; i++) {
      if (!nested) return null

      let key = keyPath[i]

      if (i + 1 === keyAmount) {
        nested[key] = value
      } else {
        nested = nested[key]
      }
    }

    return this
  }
}
