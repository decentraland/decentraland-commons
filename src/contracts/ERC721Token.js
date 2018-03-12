import { abi } from './artifacts/ERC721Token.json'
import { Contract } from '../ethereum'

/** ERC721Token contract class */
export class ERC721Token extends Contract {
  static getContractName() {
    return 'ERC721Token'
  }

  static getDefaultAbi() {
    return abi
  }

  static getDefaultAddress() {
    return ''
  }
}
