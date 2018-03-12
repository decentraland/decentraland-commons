import { abi } from './artifacts/ServiceLocator.json'
import { eth, Contract } from 'decentraland-commons'

/** ServiceLocator contract class */
export class ServiceLocator extends Contract {
  
  static getContractName() {
    return 'ServiceLocator'
  }
  
  static getDefaultAddress() {
    // Default ServiceLocator
    return '0x151b11892dd6ab1f91055dcd01d23d03a2c47570'
  }
  
  static getDefaultAbi() {
    return abi
  }

  async get(namespace) {
    return this.transaction('get', namespace)
  }

  async getNamespace(address) {
    return this.transaction('getNamespace', address)
  }

}
