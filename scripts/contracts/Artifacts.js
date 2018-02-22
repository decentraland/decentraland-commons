import path from 'path'
import { Artifact } from './Artifact'
import { findFolderPath, globPromise, fsWriteFilePromise } from './utils'

const DEFAULT_FOLDER_PATH = 'src/contracts/artifacts'

export class Artifacts {
  static PROPERTY_BLACKLIST = [
    'bytecode',
    'sourceMap',
    'deployedSourceMap',
    'sourcePath',
    'ast',
    'compiler'
  ]

  constructor(folderPath) {
    folderPath = folderPath || findFolderPath(DEFAULT_FOLDER_PATH)
    this.folderPath = folderPath
    this.collection = []
  }

  async buildCollection() {
    const paths = await this.getPaths()
    this.collection = paths.map(path => new Artifact(path))
    return this.collection
  }

  async getPaths() {
    const artifactsPattern = path.join(this.folderPath, 'MANAToken.json')
    return await globPromise(artifactsPattern)
  }

  async trim() {
    return await Promise.all(this.collection.map(artifact => artifact.trim()))
  }

  async write() {
    for (const artifact of this.collection) {
      const content = await artifact.trim()
      await fsWriteFilePromise(artifact.path, content)
    }
  }
}
