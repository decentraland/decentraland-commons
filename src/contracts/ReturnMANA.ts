import { Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/ReturnMANA.json')

/** ReturnMANA contract class */
export class ReturnMANA extends Contract {
  getContractName() {
    return 'ReturnMANA'
  }

  getDefaultAddress() {
    return env.universalGet('RETURN_MANA_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }
}
