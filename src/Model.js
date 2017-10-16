/**
 * Basic Model class for accesing inner attributes easily
 */
class Model {
  /**
   * Creates a new instance storing the attributes for later use
   * @param  {object} attributes
   * @return {Model<instance>}
   */
  constructor(attributes) {
    this.attributes = attributes || {}
  }

  /**
   * Returns true if the `attributes` property evaluates to false
   * @return {boolean}
   */
  isEmpty() {
    return ! this.get()
  }

  /**
   * Get a value for a given property name
   * @param  {string} [key] - Key on the attributes object. If falsy, it'll return the full attributes object
   * @return {[type]} Value found, if any
   */
  get(key) {
    return key ? this.attributes[key] : this.attributes
  }

  /**
   * Get a nested attribute for an object. Inspired on immutable js getIn {@link https://facebook.github.io/immutable-js/docs/#/Map/getIn}
   * @param  {array} keyPath - Path of keys to follow
   * @return {object} The value of the searched key or null if any key is missing along the way
   */
  getIn(keyPath) {
    let value = this.attributes

    for (let prop of keyPath) {
      if (! value) return null
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
   * Set a nested attribute for an object. It shortcircuits if any key is missing. Inspired on immutable js setIn {@link https://facebook.github.io/immutable-js/docs/#/Map/setIn}
   * @param  {array} keyPath - Path of keys
   * @param  {object} value  - Value to set
   * @return {Model<instace>} The instance of the model (chainable)
   */
  setIn(keyPath, value) {
    let keyAmount = keyPath.length
    let nested = this.attributes

    for (let i = 0; i < keyAmount; i++) {
      if (! nested) return null

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

export default Model
