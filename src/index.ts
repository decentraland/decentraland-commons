import * as utils from './utils'
import { NodeEnv, Env } from './env'

export * from './log'
export { NodeEnv, Env } from './env'

export { utils }
export const env: Env = new NodeEnv()
