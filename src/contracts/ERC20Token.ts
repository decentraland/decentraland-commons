import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ERC20Token.json')

/** ERC20Token contract class */
export class ERC20Token extends Contract {
  getContractName() {
    return 'ERC20Token'
  }

  getDefaultAbi() {
    return abi
  }

  getDefaultAddress() {
    return ''
  }
}
