import * as path from 'path'
import { fsReadFilePromise } from './utils'

export class Artifact {
  static PROPERTY_BLACKLIST = ['bytecode', 'sourceMap', 'deployedSourceMap', 'sourcePath', 'ast', 'compiler']

  path: string
  name: string

  constructor(filePath: string) {
    this.path = filePath
    this.name = path.basename(filePath, path.extname(filePath))
  }

  async trim() {
    let content = await fsReadFilePromise(this.path)
    content = JSON.parse(content)
    Artifact.PROPERTY_BLACKLIST.forEach(prop => delete content[prop])
    return JSON.stringify(content, null, 2)
  }
}
