import { Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/Marketplace.json')

/** Marketplace contract class */
export class Marketplace extends Contract {
  getContractName() {
    return 'Marketplace'
  }

  getDefaultAddress() {
    return env.universalGet('MARKETPLACE_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }
}
