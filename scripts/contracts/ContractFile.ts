import * as path from 'path'

export class ContractFile {
  path: string
  name: string
  abi: any

  constructor(filePath: string) {
    this.path = filePath
    this.name = path.basename(filePath, path.extname(filePath))
    this.abi = this.getAbi()
  }

  isIndex() {
    return this.name === 'index'
  }

  getAbi() {
    if (this.isIndex()) return

    try {
      // TODO: avoid use of require as a function
      const Contract = require(this.path)[this.name]
      return Contract.getDefaultAbi()
    } catch (error) {
      console.log(`Could not find an artifact for "${this.path}"`, error.message)
    }
  }

  getExtensions() {
    const extensions = {}

    for (const method of this.abi) {
      const { name, inputs, stateMutability, type } = method

      switch (type) {
        case 'function': {
          const args = [...inputs.map((input, index) => input.name || `input${index}`), '...args'].join(', ')

          if (stateMutability === 'view') {
            extensions[name] = `function(${args}) {
            return this.call('${name}', ${args})
          }`
          } else if (stateMutability === 'nonpayable') {
            extensions[name] = `function(${args}) {
            return this.transaction('${name}', ${args})
          }`
          }
          break
        }
        default:
          break
      }
    }

    return extensions
  }
}
