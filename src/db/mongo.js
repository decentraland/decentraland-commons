import { MongoClient } from 'mongodb'

import { Log } from '../log'
import { promisify } from '../utils'

const log = new Log('MongoDB')

/**
 * Client to query MongoDB. Uses `mongodb` behind the scenes. Check {@link https://docs.mongodb.com/getting-started/node/client/} for more info.
 * IMPORTANT: To use this client with the `Model` class, it should be updated to follow the common API found on `postgres.js`
 * @namespace
 */
const mongo = {
  client: null, // Defined on `.connect()`

  /**
   * Connect to the Mongo database
   * @param  {number} port
   * @param  {string} dbname
   * @param  {string} [username]
   * @param  {string} [password]
   * @return {Promise} - Resolves on connection
   */
  connect: function(port, dbname, username, password) {
    const url = `mongodb://localhost:${port}/${dbname}`

    log.info(`Connecting to ${url}`)

    return MongoClient.connect(url)
      .then(async mongodb => {
        log.info(`Connected to MongoDB ${dbname}`)

        if (username) {
          await promisify(mongodb.authenticate, mongodb)(username, password)
        }

        this.client = mongodb
      })
      .catch(error => {
        error.connectionTimedOut = this.isConnectionTimedOut(error)

        if (error.connectionTimedOut) {
          log.warn(`Connection to MongoDB ${dbname} TIMED OUT`)
        }

        return Promise.reject(error)
      })
  },

  isConnectionTimedOut: function(error) {
    // Sadly as of this writing, there's no other way to check if a mongo connection timed out
    return error.message.search(/timed out$/) !== -1
  },

  /**
   * Forward to the MongoDB collection method
   * @param  {string} collectionName - Collection name, check the [mongodb docs]{@link https://docs.mongodb.com/getting-started/node/client/} for more info.
   * @return {object} - queriable collection
   */
  collection(collectionName) {
    return this.client.collection(collectionName)
  },

  /**
   * Upsert an object to the desired collection.
   * It adds the `created_at` and `updated_at` properties by default
   * @param  {string} collectionName - Collection name
   * @param  {string} _id            - _id of the new object or of the one to update
   * @param  {object} [row]          - properties to upsert
   * @return {Promise<object>}
   */
  async save(collectionName, _id, row = null) {
    const collection = this.client.collection(collectionName)
    const exists = await this.exists(collectionName, { _id })

    if (exists && !row) return // Nothing to do here

    if (exists) {
      row.updated_at = new Date()
      return await collection.update({ _id }, { $set: row })
    } else {
      row = Object.assign({ _id, created_at: new Date() }, row)
      return await collection.insertOne(row)
    }
  },

  /**
   * Checks if a certain `query` returns any result
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<boolean>}
   */
  async exists(collectionName, query = {}) {
    const count = await this.client
      .collection(collectionName)
      .find(query)
      .count()

    return count > 0
  },

  /**
   * Find objects on a collection
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<array<object>>}
   */
  async find(collectionName, query) {
    if (!this.client) {
      throw new Error(
        'Connection to database not found, have you called `.connect()` already?'
      )
    }

    return await this.client
      .collection(collectionName)
      .find(query)
      .toArray()
  },

  /**
   * Find the first match for a query
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<object>}
   */
  async findOne(collectionName, query) {
    if (!this.client) {
      throw new Error(
        'Connection to database not found, have you called `.connect()` already?'
      )
    }

    return await this.client.collection(collectionName).findOne(query)
  },

  /**
   * Forward aggregate to MongoDB
   * @param  {string} collectionName
   * @param  {object} query - Query to forward to MongoDB
   * @return {Promise<object>}
   */
  async aggregate(collectionName, query) {
    if (!this.client) {
      throw new Error(
        'Connection to database not found, have you called `.connect()` already?'
      )
    }

    return await this.client
      .collection(collectionName)
      .aggregate(query)
      .toArray()
  },

  /**
   * Close the db connection
   */
  close: function() {
    if (this.client) {
      this.client.close()
    }
  }
}

module.exports = mongo
