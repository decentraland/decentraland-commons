import { abi } from './artifacts/LANDTestSale.json'
import { Contract } from '../ethereum'
import { env } from '../env'

/** LANDTestSale contract class */
export class LANDTestSale extends Contract {
  static getContractName() {
    return 'LANDTestSale'
  }

  static getDefaultAddress() {
    return env.universalGet('LAND_TEST_SALE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  buy(x, y) {
    return this.transaction('buy', x, y, { gas: 120000 })
  }
}
