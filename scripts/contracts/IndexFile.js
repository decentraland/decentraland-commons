import { ContractFile } from './ContractFile'

export class IndexFile {
  constructor(contractPaths) {
    this.contractPaths = contractPaths
    this.contracts = this.instantiateContracts()
  }

  instantiateContracts() {
    return this.contractPaths
      .map(path => new ContractFile(path))
      .filter(contract => !!contract.abi)
  }

  build() {
    return `
// This is auto-generated code
// Changes here will be lost

${this.buildImports()}

${this.buildDefinitions()}

${this.buildExports()}`
  }

  buildImports() {
    return this.contracts
      .map(contract => `import { ${contract.name} } from './${contract.name}'`)
      .join('\n')
  }

  buildDefinitions() {
    return this.contracts
      .map(contract => {
        const extensions = contract.getExtensions()
        const extensionObject = Object.keys(extensions)
          .map(name => `${name}: ${extensions[name]}`)
          .join(',\n\t\t')

        return `Object.assign(
            ${contract.name}.prototype, {
            ${extensionObject}
          },
          ${contract.name}.prototype
        )`
      })
      .join('\n\n')
  }

  buildExports() {
    return `export {
      ${this.contracts.map(contract => contract.name)}
    }`
  }
}
