import Web3 from 'web3'

import { Contract } from './Contract'
import { Wallet } from './Wallet'

export class NodeWallet extends Wallet {
  async connect(providerUrl) {
    const provider = await this.getProvider(providerUrl)
    if (!provider) {
      throw new Error('Could not get a valid provider for web3')
    }

    this.web3 = new Web3(provider)

    if (!this.account) {
      const accounts = await this.getAccounts()
      if (accounts.length === 0) {
        throw new Error('Could not connect to web3')
      }

      this.setAccount(accounts[0])
    }
  }

  /**
   * It'll fetch the provider from the `window` object or default to a new HttpProvider instance
   * @param  {string} [providerURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
   * @return {object} The web3 provider
   */
  getProvider(providerUrl = 'http://localhost:8545') {
    return typeof window === 'undefined'
      ? new Web3.providers.HttpProvider(providerUrl)
      : window.web3 && window.web3.currentProvider
  }

  async getAccounts() {
    return await Contract.transaction(this.web3.eth.getAccounts)
  }

  async sign(message) {
    const sign = this.web3.personal.sign.bind(this.web3.personal)
    return await Contract.transaction(sign, message, this.account)
  }

  async recover(message, signature) {
    return await this.web3.personal.ecRecover(message, signature)
  }
}
