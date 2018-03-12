import { abi } from './artifacts/Marketplace.json'
import { Contract } from '../ethereum'
import { env } from '../env'

/** Marketplace contract class */
export class Marketplace extends Contract {
  static getContractName() {
    return 'Marketplace'
  }

  static getDefaultAddress() {
    return env.universalGet('MARKETPLACE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }
}
