import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ERC721Token.json')

/** ERC721Token contract class */
export class ERC721Token extends Contract {
  getContractName() {
    return 'ERC721Token'
  }

  getDefaultAbi() {
    return abi
  }

  getDefaultAddress() {
    return ''
  }
}
