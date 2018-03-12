import { abi } from './artifacts/ERC20Token.json'
import { Contract } from '../ethereum'

/** ERC20Token contract class */
export class ERC20Token extends Contract {
  static getContractName() {
    return 'ERC20Token'
  }

  static getDefaultAbi() {
    return abi
  }

  static getDefaultAddress() {
    return ''
  }
}
