/**
 * Promisifies a node callback style function. Takes a second argument that is bound as `this`
 * @param  {Function} fn     - Node style callback, accepting (error, result)
 * @param  {object}   [that] - Bound this
 * @return {Promise}
 */
export function promisify(fn, that) {
  return (...args) => new Promise((resolve, reject) => {
    if (that) {
      fn = fn.bind(that)
    }
    fn(...args, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * Sleep for a certain amount of milliseconds
 * @param {integer} ms - miliseconds to sleep
 * @return {Promise} - Promise that resolves when the sleeping is done
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Object.values polyfill
 * @param {object} obj - Object to get the values from
 */
export function getObjectValues(obj) {
  return obj && Object.keys(obj).map(key => obj[key])
}
