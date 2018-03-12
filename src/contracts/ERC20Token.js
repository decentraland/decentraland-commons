import { abi } from './artifacts/ERC20Token.json'
import { eth, Contract } from '../ethereum'

/** ERC20Token contract class */
export class ERC20Token extends Contract {
  static getContractName() {
    return 'ERC20Token'
  }

  static getDefaultAbi() {
    return abi
  }

  async transfer(toAddress, amount) {
    return this.transaction('transfer', toAddress, eth.utils.toWei(amount))
  }

  async getBalance(owner) {
    const balance = await this.getBalanceWei(owner)
    return eth.utils.fromWei(balance)
  }

  getBalanceWei(owner) {
    return this.call('balanceOf', owner)
  }
}
