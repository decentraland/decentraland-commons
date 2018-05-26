import * as utils from './utils'
import { BrowserEnv } from './env'

export * from './log'
export { BrowserEnv, Env } from './env'

export { utils }
export const env = new BrowserEnv()
