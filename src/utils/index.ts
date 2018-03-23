/**
 * Promisifies a node callback style function. Takes a second argument that is bound as `this`
 * @param  {Function} fn - Node style callback, accepting (error, result)
 * @return {Promise}
 */
export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
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
 * Check if an object has keys
 * @param {object} obj
 */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0
}

/**
 * Return a copy of the object, filtered to omit the blacklisted array of valid keys
 * @param {object} obj
 * @param {array} keys
 */
export function omit(obj, keys) {
  const newKeys = Object.keys(obj).filter(key => !keys.includes(key))
  return pick(obj, newKeys)
}

/**
 * Returns a copy of the array of with the keys filtered on each object
 * @param {array} array - array of objects
 * @param {array} keys
 */
export function mapOmit(array, keys) {
  return array.map(obj => omit(obj, keys))
}

/**
 * Return a copy of the object, filtered to only have values for the whitelisted array of valid keys
 * @param {object} obj
 * @param {array} keys
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result: any = {}

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }

  return result
}

/**
 * Return a an object using a field as key out of an array of objects
 * @param {array} arr
 * @param {string} key
 * @param {string} (optional) value - use only one field of object as value
 */
export function arrayToObject<T, K extends keyof T>(
  arr: T[],
  key: K
): { [P in K]: T }
export function arrayToObject<T, K extends keyof T, V extends keyof T>(
  arr: T[],
  key: K,
  valueKey: V
): { [P in K]: T[V] }
export function arrayToObject<T>(
  arr: T[],
  key: keyof T,
  value: keyof T | null = null
) {
  return arr.reduce(
    (map, obj) => {
      map[obj[key]] = value != null ? obj[value] : obj
      return map
    },
    {} as any
  )
}
