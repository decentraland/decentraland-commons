import Web3 = require('web3')

import { Wallet } from './Wallet'
import { Contract } from '../Contract'

declare var window

export class NodeWallet extends Wallet {
  web3: any
  account: any

  getType(): string {
    return 'node'
  }

  async connect(providerUrl?: string) {
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

  async getAccounts(): Promise<any[]> {
    return Contract.transaction(this.web3.eth.getAccounts)
  }

  async sign(message: string) {
    const sign = this.web3.personal.sign.bind(this.web3.personal)
    return Contract.transaction(sign, message, this.account)
  }

  async recover(message: string, signature: string) {
    return this.web3.personal.ecRecover(message, signature)
  }
}
