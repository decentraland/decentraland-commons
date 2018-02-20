import { abi } from './artifacts/DecentralandVesting.json'
import { eth, Contract } from '../ethereum'
import { env } from '../env'

/** DecentralandVesting contract class */
export class DecentralandVesting extends Contract {
  static getContractName() {
    return 'DecentralandVesting'
  }

  static getDefaultAddress() {
    return env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  async duration() {
    const bigNumber = await this.call('duration')
    return bigNumber.toNumber()
  }

  async cliff() {
    const bigNumber = await this.call('cliff')
    return bigNumber.toNumber()
  }

  async vestedAmount() {
    const bigNumber = await this.call('vestedAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async releasableAmount() {
    const bigNumber = await this.call('releasableAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async released() {
    const bigNumber = await this.call('released')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async start() {
    const bigNumber = await this.call('start')
    return bigNumber.toNumber()
  }
}
