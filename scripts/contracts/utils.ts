import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

export function findFolderPath(destination) {
  let folderPath = null

  walkUp(destination, function(contractsPath) {
    if (fs.existsSync(contractsPath)) {
      folderPath = contractsPath

      return true
    }
  })

  return folderPath
}

export function walkUp(destination: string, callback: (a: string) => any) {
  let destinationPath = ''
  let parents = []

  while (parents.length <= 3) {
    destinationPath = path.resolve(...parents, destination)

    const result = callback(destinationPath)

    if (result) break

    parents.push('..')
  }

  return destinationPath
}

export function globPromise(pattern: string, options?: any) {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, options, function(error, paths) {
      if (error || paths.length === 0) {
        error = error || new Error(`Could not find any contracts for "${pattern}"`)
        reject(error)
      } else {
        resolve(paths)
      }
    })
  })
}

export function fsReadFilePromise(path) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, 'utf8', function(error, text) {
      if (error) {
        reject(error)
      } else {
        resolve(text)
      }
    })
  })
}

export function fsWriteFilePromise(path, text) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, text, 'utf8', function(error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
