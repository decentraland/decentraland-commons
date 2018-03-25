import * as path from 'path'
import { Artifact } from './Artifact'
import { findFolderPath, globPromise, fsWriteFilePromise } from './utils'

const DEFAULT_FOLDER_PATH = 'src/contracts/artifacts'

export class Artifacts {
  static PROPERTY_BLACKLIST = ['bytecode', 'sourceMap', 'deployedSourceMap', 'sourcePath', 'ast', 'compiler']

  folderPath: string
  collection: Artifact[] = []

  constructor(folderPath: string) {
    folderPath = folderPath || findFolderPath(DEFAULT_FOLDER_PATH)
    this.folderPath = folderPath
  }

  async buildCollection() {
    const paths = await this.getPaths()
    this.collection = paths.map(path => new Artifact(path))
    return this.collection
  }

  async getPaths() {
    const artifactsPattern = path.join(this.folderPath, 'MANAToken.json')
    return globPromise(artifactsPattern)
  }

  async trim() {
    return Promise.all(this.collection.map(artifact => artifact.trim()))
  }

  async write() {
    for (const artifact of this.collection) {
      const content = await artifact.trim()
      await fsWriteFilePromise(artifact.path, content)
    }
  }
}
