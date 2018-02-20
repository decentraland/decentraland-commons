import fs from 'fs'
import path from 'path'
import glob from 'glob'

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

export function walkUp(destination, callback) {
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

export function globPromise(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, function(error, paths) {
      if (error || paths.length === 0) {
        error = error || `Could not find any contracts for "${pattern}"`
        reject(error)
      } else {
        resolve(paths)
      }
    })
  })
}

export function fsReadFilePromise(path) {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, 'utf8', function(error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
