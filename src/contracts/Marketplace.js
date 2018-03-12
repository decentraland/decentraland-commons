import { abi } from './artifacts/Marketplace.json'
import { eth, Contract } from '../ethereum'
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

  async executeOrder(assetId, amount) {
    return this.transaction('executeOrder', assetId, eth.utils.toWei(amount))
  }
}
