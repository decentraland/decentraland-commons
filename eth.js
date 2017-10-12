import Web3 from 'web3'
import abiDecoder from 'abi-decoder'

import manaArtifact from './contracts/MANAToken.json'

import { getEnv } from './env'
import log from './log'
import { promisify } from './utils'
import * as env from './env'

let web3 = null


export default {

  /**
   * Contract instance linked to the MANA contract for the current network.
   */
  MANA: null, // set in `connect`

  manaArtifact,

  /**
   * Link to web3's BigNumber reference
   */
  BigNumber: Web3.utils && Web3.utils.BN,

  connect(defaultAccount) {
    if (web3 !== null) return

    const currentProvider = this.getWeb3Provider()
    if (! currentProvider) {
      log.info('Could not get a valid provider for web3')
      return false
    }

    log.info('Instantiating contracts')
    web3 = new Web3(currentProvider)
    if (web3.BigNumber) {
      this.BigNumber = web3.BigNumber
    }

    this.manaInstance = this.buildInstance(manaArtifact.abi, env.getManaContractAddress())

    this.setAddress(defaultAccount || web3.eth.accounts[0])

    if (! this.getAddress()) {
      log.warn('Could not get the default address from web3')
      return false
    }

    log.info(`Got ${this.getAddress()} as current user address`)
    return true
  },

  buildInstance(abi, address) {
    const Contract = web3.eth.contract(abi)
    abiDecoder.addABI(abi)
    return Contract.at(address)
  },

  getWeb3Provider() {
    return new Web3.providers.HttpProvider(env.getWeb3HTTPProvider())
  },

  async getMANABalance(sender) {
    const manaBalance = await this.getMANABalanceWei(sender)
    return this.fromWei(manaBalance)
  },

  async getMANABalanceWei(sender) {
    return await this.manaInstance.balanceOf(sender)
  },

  async fetchTxStatus(txId) {
    log.info(`[eth] Getting ${txId} status`)
    const tx = await transaction(web3.eth.getTransaction, txId)

    if (tx) this.attachCurrentManaToTX(tx)

    return tx
  },

  async fetchTxReceipt(txId) {
    log.info(`[eth] Getting ${txId} recepeit`)
    const recepeit = await transaction(web3.eth.getTransactionReceipt, txId)

    if (recepeit) {
      recepeit.logs = this.decodeLogs(recepeit.logs)
    }

    return recepeit
  },

  attachCurrentManaToTX(tx) {
    tx.method = this.decodeMethod(tx.input)
    tx.currentMana = this.findParamValue(tx.method, 'mana') || this.findParamValue(tx.method, '_value')
    return tx
  },

  fromWei(amount, unit='ether') {
    amount = web3.toBigNumber(amount)
    return web3.fromWei(amount, unit).toNumber(10)
  },

  toWei(amount, unit='ether') {
    amount = web3.toBigNumber(amount)
    return web3.toWei(amount, unit).toNumber(10)
  },

  hexToUtf8(hex) {
    return web3.toUtf8(hex)
  },

  recoverAddress(message, signature) {
    return web3.personal.ecRecover(message, signature)
  },

  setAddress(address) {
    web3.eth.defaultAccount = address
  },

  getAddress() {
    return web3.eth.defaultAccount
  },

  decodeMethod(input) {
    return abiDecoder.decodeMethod(input)
  },

  decodeLogs(logs) {
    return abiDecoder.decodeLogs(logs)
  },

  findParamValue(decodedMethod, paramName) {
    /*
      {
        "name": "methodName",
        "params": [
          {
            "name": "paramName",
            "value": "3.6858e+22",
            "type": "uint256"
          }
        ]
      }
    */
    const param = (decodedMethod.params || []).find(param => param.name === paramName)

    if (param) {
      return this.fromWei(param.value)
    }
  }
}

// ----------------------------------------
// Helpers

async function transaction(method, ...args) {
  return await promisify(method)(...args)
}
