import { abi } from './artifacts/ERC721Token.json'
import { eth, Contract } from 'decentraland-commons'

/** ERC721Token contract class */
export class ERC721Token extends Contract {
  
  static getContractName() {
    return 'ERC721Token'
  }
  
  static getDefaultAddress() {
    return ''
  }
  
  static getDefaultAbi() {
    return abi
  }

  async ownerOf(tokenId) {
    return this.transaction('ownerOf', tokenId)
  }

  async getBalance(owner) {
    const balance = await this.getBalanceWei(owner)
    return eth.utils.fromWei(balance)
  }

  getBalanceWei(owner) {
    return this.call('balanceOf', owner)
  }
}
