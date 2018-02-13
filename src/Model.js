import * as dbClients from './db'
import * as utils from './utils'

/**
 * Basic Model class for accesing inner attributes easily
 */
export class Model {
  static tableName = null
  static columnNames = []
  static primaryKey = 'id'

  /**
   * DB client to use. We use Postgres by default. Can be changed via Model.useDB('db client')
   * It's the same for
   * @type {object}
   */
  static db = dbClients['postgres']

  /**
   * Change the current DB client
   * @param {string|object} dbClient - The name of an available db client (from /db) or an object with the same API
   */
  static setDb(dbClient = 'postgres') {
    if (typeof dbClient === 'string' && !dbClients[dbClients]) {
      throw new Error(`Undefined db client ${dbClients}`)
    }

    this.db = dbClients[dbClients]
  }

  /**
   * Return the rows that match the conditions
   * @param  {object} [conditions] - It returns all rows if empty
   * @param  {object} [orderBy]
   * @return {Promise<array>}
   */
  static async find(conditions, orderBy) {
    return await this.db.select(this.tableName, conditions, orderBy)
  }

  /**
   * Return the row for the supplied primaryKey or condition object
   * @param  {string|number|object} primaryKeyOrCond - If the argument is an object it uses it for the conditions. Otherwise it'll use it as the searched primaryKey.
   * @return {Promise<object>}
   */
  static async findOne(primaryKeyOrCond, orderBy) {
    const conditions =
      typeof primaryKeyOrCond === 'object'
        ? primaryKeyOrCond
        : { [this.primaryKey]: primaryKeyOrCond }

    return await this.db.selectOne(this.tableName, conditions, orderBy)
  }

  /**
   * Count the rows for the talbe
   * @return {Promise<integer>}
   */
  static async count() {
    const result = await this.db.query(
      `SELECT COUNT(*) as count
        FROM ${this.tableName}`
    )

    return result.length ? parseInt(result[0].count, 10) : 0
  }

  /**
   * Insert the row filtering the Model.columnNames to the Model.tableName table
   * @param  {object} row
   * @return {Promise<object>} the row argument with the inserted primaryKey
   */
  static async insert(row) {
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
  static async update(changes, conditions) {
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
  static delete(conditions) {
    return this.db.delete(this.tableName, conditions)
  }

  /**
   * Checks to see if all column names exist on the attributes object.
   * If you need a more complex approach (skipping NULLABLE columns for example) you can override it.
   * @param  {object}  attributes - Model attributes to check
   * @return {boolean} true if at least one of the properties don't exist on the object
   */
  static isIncomplete(attributes) {
    return this.columnNames.some(column => !attributes.hasOwnProperty(column))
  }

  /**
   * Creates a new instance storing the attributes for later use
   * @param  {object} attributes
   * @return {Model<instance>}
   */
  constructor(attributes) {
    this.attributes = attributes || {}
  }

  /**
   * Return the row for the this.attributes primaryKey property, forwards to Model.findOne
   * @return {Promise<object>}
   */
  async retreive() {
    const primaryKey = this.attributes[this.constructor.primaryKey]
    this.attributes = await this.constructor.findOne(primaryKey)
    return this.attributes
  }

  /**
   * Forwards to Mode.insert using this.attributes
   */
  async insert() {
    return await this.constructor.insert(this.attributes)
  }

  /**
   * Forwards to Mode.update using this.attributes. If no conditions are supplied, it uses this.attributes[primaryKey]
   * @params {object} [conditions={ primaryKey: this.attributes[primaryKey] }]
   */
  async update(conditions) {
    if (!conditions) {
      const primaryKey = this.constructor.primaryKey
      conditions = { [primaryKey]: this.attributes[primaryKey] }
    }
    return await this.constructor.update(this.attributes, conditions)
  }

  /**
   * Forwards to Mode.delete using this.attributes. If no conditions are supplied, it uses this.attributes[primaryKey]
   * @params {object} [conditions={ primaryKey: this.attributes[primaryKey] }]
   */
  async delete(conditions) {
    if (!conditions) {
      const primaryKey = this.constructor.primaryKey
      conditions = { [primaryKey]: this.attributes[primaryKey] }
    }
    return await this.constructor.delete(conditions)
  }

  /**
   * Returns true if the `attributes` property evaluates to false
   * @return {boolean}
   */
  isEmpty() {
    return !this.get()
  }

  /**
   * Forwards to Mode.isIncomplete using this.attributes.
   * @return {boolean}
   */
  isIncomplete() {
    return this.constructor.isIncomplete(this.attributes)
  }

  /**
   * Get a value for a given property name
   * @param  {string} [key] - Key on the attributes object. If falsy, it'll return the full attributes object
   * @return {object} Value found, if any
   */
  get(key) {
    return key ? this.attributes[key] : this.attributes
  }

  /**
   * Get a nested attribute for an object. Inspired on [immutable js getIn]{@link https://facebook.github.io/immutable-js/docs/#/Map/getIn}
   * @param  {array} keyPath - Path of keys to follow
   * @return {object} The value of the searched key or null if any key is missing along the way
   */
  getIn(keyPath) {
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
  set(key, value) {
    this.attributes[key] = value
    return this
  }

  /**
   * Set a nested attribute for an object. It shortcircuits if any key is missing. Inspired on [immutable js setIn]{@link https://facebook.github.io/immutable-js/docs/#/Map/setIn}
   * @param  {array} keyPath - Path of keys
   * @param  {object} value  - Value to set
   * @return {Model<instace>} The instance of the model (chainable)
   */
  setIn(keyPath, value) {
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
