import { eth, Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/DecentralandVesting.json')

export type BigNumber = {
  toNumber(): number
}

/** DecentralandVesting contract class */
export class DecentralandVesting extends Contract {
  getContractName() {
    return 'DecentralandVesting'
  }

  getDefaultAddress() {
    return env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }

  async duration() {
    const bigNumber: BigNumber = await this.call('duration')
    return bigNumber.toNumber()
  }

  async cliff() {
    const bigNumber: BigNumber = await this.call('cliff')
    return bigNumber.toNumber()
  }

  async vestedAmount() {
    const bigNumber: BigNumber = await this.call('vestedAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async releasableAmount() {
    const bigNumber: BigNumber = await this.call('releasableAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async released() {
    const bigNumber: BigNumber = await this.call('released')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async start() {
    const bigNumber: BigNumber = await this.call('start')
    return bigNumber.toNumber()
  }
}
