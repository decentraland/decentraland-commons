import { Env } from './Env'

export class BrowserEnv extends Env {
  constructor() {
    super()
    this.loaded = true
  }
}
