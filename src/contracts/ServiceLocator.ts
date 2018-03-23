import { Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/ServiceLocator.json')

/** ServiceLocator contract class */
export class ServiceLocator extends Contract {
  getContractName() {
    return 'ServiceLocator'
  }

  getDefaultAddress() {
    return env.universalGet('SERVICE_LOCATOR_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }
}
