import dbClients from "./db";
import * as utils from "./utils";

/**
 * Basic Model class for accesing inner attributes easily
 */
class Model {
  static tableName = null;
  static columnNames = [];

  /**
   * DB client to use. We use Postgres by default. Can be changed via Model.useDB('db client')
   * It's the same for
   * @type {object}
   */
  static db = dbClients["postgres"];

  /**
   * Change the current DB client
   * @param {string|object} dbClient - The name of an available db client (from /db) or an object with the same API
   */
  static setDb(dbClient = "postgres") {
    if (typeof dbClient === "string" && !dbClients[dbClients]) {
      throw new Error(`Undefined db client ${dbClients}`);
    }

    this.db = dbClients[dbClients];
  }

  /**
   * Return all rows from the table
   * @return {Promise<array>}
   */
  static async all() {
    return await this.db.select(this.tableName);
  }

  /**
   * Return the row for the supplied id
   * @param  {string|number} id
   * @return {Promise<object>}
   */
  static async findOne(id) {
    return await this.db.selectOne(this.tableName, { id });
  }

  /**
   * Insert the row filtering the Model.columnNames to the Model.tableName table
   * @param  {object} row
   * @return {Promise<object>} the row argument with the inserted id
   */
  static async insert(row) {
    const insertion = await this.db.insert(
      this.tableName,
      utils.pick(row, this.columnNames)
    );
    row.id = insertion.rows[0].id;
    return row;
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
    );
  }

  /**
   * Delete the row on the Model.tableName table.
   * @param  {object} conditions - An object describing the WHERE clause.
   * @return {Promise<object>}
   */
  static async delete(changes, conditions) {
    return await this.db.delete(this.tableName, conditions);
  }

  /**
   * Creates a new instance storing the attributes for later use
   * @param  {object} attributes
   * @return {Model<instance>}
   */
  constructor(attributes) {
    this.attributes = attributes || {};
  }

  /**
   * Return the row for the this.attributes id property, fordwards to Model.findOne
   * @return {Promise<object>}
   */
  async retreive() {
    this.attributes = await this.constructor.findOne(this.attributes.id);
    return this.attributes;
  }

  /**
   * Forwards to Mode.insert using this.attributes
   */
  async insert() {
    return await this.constructor.insert(this.attributes);
  }

  /**
   * Forwards to Mode.update using this.attributes. If no conditions are supplied, it uses this.attributes.id
   * @params {object} [conditions]
   */
  async update(conditions = { id: this.attributes.id }) {
    return await this.constructor.update(this.attributes, conditions);
  }

  /**
   * Forwards to Mode.delete using this.attributes. If no conditions are supplied, it uses this.attributes.id
   * @params {object} [conditions]
   */
  async delete(conditions = { id: this.attributes.id }) {
    return await this.constructor.delete(conditions);
  }

  /**
   * Returns true if the `attributes` property evaluates to false
   * @return {boolean}
   */
  isEmpty() {
    return !this.get();
  }

  /**
   * Get a value for a given property name
   * @param  {string} [key] - Key on the attributes object. If falsy, it'll return the full attributes object
   * @return {[type]} Value found, if any
   */
  get(key) {
    return key ? this.attributes[key] : this.attributes;
  }

  /**
   * Get a nested attribute for an object. Inspired on immutable js getIn {@link https://facebook.github.io/immutable-js/docs/#/Map/getIn}
   * @param  {array} keyPath - Path of keys to follow
   * @return {object} The value of the searched key or null if any key is missing along the way
   */
  getIn(keyPath) {
    let value = this.attributes;

    for (let prop of keyPath) {
      if (!value) return null;
      value = value[prop];
    }

    return value;
  }

  /**
   * Set a top level key with a value
   * @param {string} key
   * @param {object} value
   * @return {Model<instace>} The instance of the model (chainable)
   */
  set(key, value) {
    this.attributes[key] = value;
    return this;
  }

  /**
   * Set a nested attribute for an object. It shortcircuits if any key is missing. Inspired on immutable js setIn {@link https://facebook.github.io/immutable-js/docs/#/Map/setIn}
   * @param  {array} keyPath - Path of keys
   * @param  {object} value  - Value to set
   * @return {Model<instace>} The instance of the model (chainable)
   */
  setIn(keyPath, value) {
    let keyAmount = keyPath.length;
    let nested = this.attributes;

    for (let i = 0; i < keyAmount; i++) {
      if (!nested) return null;

      let key = keyPath[i];

      if (i + 1 === keyAmount) {
        nested[key] = value;
      } else {
        nested = nested[key];
      }
    }

    return this;
  }
}

module.exports = Model;
