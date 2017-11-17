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
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
}

/**
 * Sleep for a certain amount of milliseconds
 * @param {integer} ms - miliseconds to sleep
 * @return {Promise} - Promise that resolves when the sleeping is done
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an object has keys
 * @param {object} obj
 */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0;
}

/**
 * Object.values polyfill
 * @param {object} obj - Object to get the values from
 */
export function getObjectValues(obj) {
  return obj && Object.keys(obj).map(key => obj[key]);
}

/**
 * Return a copy of the object, filtered to omit the blacklisted array of valid keys
 * @param {object} obj
 * @param {array} keys
 */
export function omit(obj, keys) {
  const newKeys = Object.keys(obj).filter(key => !keys.includes(key));
  return pick(obj, newKeys);
}

/**
 * Return a copy of the object, filtered to only have values for the whitelisted array of valid keys
 * @param {object} obj
 * @param {array} keys
 */
export function pick(obj, keys) {
  const result = {};

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Return a an object using a field as key out of an array of objects
 * @param {array} arr
 * @param {string} key
 * @param {string} (optional) value - use only one field of object as value
 */
export function arrayToObject(arr, key, value) {
  return arr.reduce((map, obj) => {
    map[obj[key]] = value != null ? obj[value] : obj;
    return map;
  }, {});
}
