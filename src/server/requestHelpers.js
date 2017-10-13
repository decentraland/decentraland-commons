import { Log } from '../log'


const log = new Log('[server]')


/**
 * Wrapper for the request handler. It creates the appropiate response object and catches errors. For example:
 *     app.post('/api/path', handleRequest(async (req, res) => {
 *        const param = extractFromReq(req, 'param')
 *        return 'Success'
 *    }))
 * @param  {function} callback - Actual handler, the return value will be used as response to the client. It will receive (req, res) as parameters
 * @return {function} - Wrapper function
 */
export function handleRequest(callback) {
  return async (req, res) => {
    log.info('Handling request to', req.path)

    try {
      const data = await callback(req, res)

      return res.json(sendOk(data))

    } catch(error) {
      log.error('Error handling request', req.path, error)

      const data = error.data || {}
      const message = error.message

      return res.json(sendError(data, message))
    }
  }
}

/**
 * Get a named parameter from a request object. It leverages GET and POST requests and parses JSON objects
 * @param  {object} req   - Express js request object. {@link https://expressjs.com}
 * @param  {string} param - Searched param
 * @return {object} - The param value, it throws if it's not present
 */
export function extractFromReq(req, param) {
  let value = null

  if (req.params[param]) {
    return req.params[param]
  }

  if (req.query[param]) {
    value = req.query[param]

  } else if (req.body[param]) {
    value = req.body[param]
  }

  if (req.headers['content-type'] === 'application/json') {
    value = JSON.parse(value)
  }

  if (! value) {
    throw new Error(`Could not get ${param} from request`)
  }

  return value
}


function sendOk(data) {
  return { ok: true, data }
}

function sendError(data, error) {
  return { ok: false, data, error }
}
