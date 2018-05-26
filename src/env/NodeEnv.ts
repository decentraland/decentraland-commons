import * as fs from 'fs'
import { isEmptyObject } from '../utils'
import { Env } from './Env'

export class NodeEnv extends Env {
  /**
   * Sets the `loaded` variable to true enabling the rest of the ENV variables to be accessed.
   * If we're on a node environment ensure that this method it's called first, as it parses the .env file and adds all variables to the environment.
   * See {@link https://github.com/motdotla/dotenv#faq} for more info on dotenv.
   * @param {object} [config] - Configuration for .env
   * @param {string} [config.path='./.env'] - Path to the .env file
   * @param {object} [config.values={}] - Object defining the environment.
   */
  load({ path = './.env', values = {} } = {}) {
    if (isEmptyObject(values) && fs.existsSync(path)) {
      const envString = fs.readFileSync(path).toString()
      values = this.parse(envString)
    }

    Object.assign(process.env, values)

    this.loaded = true
  }
}
