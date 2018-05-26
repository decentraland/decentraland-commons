import * as utils from './utils'
import { BrowserEnv, Env } from './env'

export * from './log'
export { BrowserEnv, Env } from './env'

export { utils }
export const env: Env = new BrowserEnv()
