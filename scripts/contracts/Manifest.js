import path from 'path'
import { findFolderPath, globPromise, fsWriteFilePromise } from './utils'

const DEFAULT_FOLDER_PATH = 'src/contracts'

export class Manifest {
  constructor(folderPath) {
    folderPath = folderPath || findFolderPath(DEFAULT_FOLDER_PATH)
    this.folderPath = folderPath
  }

  getPaths() {
    const contractsPattern = path.join(this.folderPath, '*.js')
    return globPromise(contractsPattern)
  }

  write(text = '') {
    const manifestPath = path.join(this.folderPath, 'index.js')
    return fsWriteFilePromise(manifestPath, text)
  }
}
