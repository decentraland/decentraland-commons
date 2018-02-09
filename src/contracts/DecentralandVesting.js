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

  async getDuration() {
    const bigNumber = await this.call('duration')
    return bigNumber.toNumber()
  }

  async getCliff() {
    const bigNumber = await this.call('cliff')
    return bigNumber.toNumber()
  }

  getBeneficiary() {
    return this.call('beneficiary')
  }

  async getVestedAmount() {
    const bigNumber = await this.call('vestedAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async getReleasableAmount() {
    const bigNumber = await this.call('releasableAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  isRevoked() {
    return this.call('revoked')
  }

  isRevocable() {
    return this.call('revocable')
  }

  getOwner() {
    return this.call('owner')
  }

  async getReleased() {
    const bigNumber = await this.call('released')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async getStart() {
    const bigNumber = await this.call('start')
    return bigNumber.toNumber()
  }

  release() {
    return this.transaction('release')
  }

  changeBeneficiary(address) {
    return this.transaction('changeBeneficiary', address)
  }
}
