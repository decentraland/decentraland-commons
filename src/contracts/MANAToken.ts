import { eth, Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/MANAToken.json')

/** MANAToken contract class */
export class MANAToken extends Contract {
  getContractName() {
    return 'MANAToken'
  }

  getDefaultAddress() {
    return env.universalGet('MANA_TOKEN_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }

  async approve(spender, mana) {
    return this.transaction('approve', spender, eth.utils.toWei(mana))
  }

  async allowance(owner, spender) {
    const assigned = await this.call('allowance', owner, spender)
    return eth.utils.fromWei(assigned)
  }

  async balanceOf(owner) {
    const manaBalance = await this.call('balanceOf', owner)
    return eth.utils.fromWei(manaBalance)
  }
}
