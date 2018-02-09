import { abi } from './artifacts/MANAToken.json'
import { eth, Contract } from '../ethereum'
import { env } from '../env'

/** MANAToken contract class */
export class MANAToken extends Contract {
  static getContractName() {
    return 'MANAToken'
  }

  static getDefaultAddress() {
    return env.universalGet('MANA_TOKEN_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  async approve(spender, mana) {
    return this.transaction('approve', spender, eth.utils.toWei(mana))
  }

  async getAllowance(owner, spender) {
    const assigned = await this.getAllowanceWei(owner, spender)
    return eth.utils.fromWei(assigned)
  }

  getAllowanceWei(owner, spender) {
    return this.call('allowance', owner, spender)
  }

  async getBalance(owner) {
    const manaBalance = await this.getBalanceWei(owner)
    return eth.utils.fromWei(manaBalance)
  }

  getBalanceWei(owner) {
    return this.call('balanceOf', owner)
  }
}
