import { ContractFile } from './ContractFile'

const helpers = {
  extend(object, extension) {
    for (const prop in extension) {
      if (!(prop in object)) object[prop] = extension[prop]
    }
  }
}

export class IndexFile {
  contracts: ContractFile[]

  constructor(public contractPaths: string[]) {
    this.contracts = this.instantiateContracts()
  }

  instantiateContracts() {
    return this.contractPaths.map(path => new ContractFile(path)).filter(contract => !!contract.abi)
  }

  build() {
    return `
// This is auto-generated code
// Changes here will be lost

${this.buildImports()}

${this.buildHelpers()}

${this.buildDefinitions()}

${this.buildExports()}`
  }

  buildImports() {
    return this.contracts.map(contract => `import { ${contract.name} } from './${contract.name}'`).join('\n')
  }

  buildHelpers() {
    return Object.values(helpers)
      .map(String)
      .join('\n')
  }

  buildDefinitions() {
    return this.contracts
      .map(contract => {
        const extensions = contract.getExtensions()
        const extensionObject = Object.keys(extensions)
          .map(name => `${name}: ${extensions[name]}`)
          .join(',\n\t\t')

        return `extend(${contract.name}.prototype, {
          ${extensionObject}
        })`
      })
      .join('\n\n')
  }

  buildExports() {
    return `export {
      ${this.contracts.map(contract => contract.name)}
    }`
  }
}
