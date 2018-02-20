import { abi } from './artifacts/ReturnMANA.json'
import { Contract } from '../ethereum'
import { env } from '../env'

/** ReturnMANA contract class */
export class ReturnMANA extends Contract {
  static getContractName() {
    return 'ReturnMANA'
  }

  static getDefaultAddress() {
    return env.universalGet('RETURN_MANA_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }
}
