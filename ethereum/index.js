import Web3 from 'web3'

import { Log } from '../log'
import * as env from '../env'

import Contract from './Contract'


const log = new Log('[Ethrereum]')
let web3 = null


export default {
  contracts: {},

  connect(contracts, defaultAccount) {
    if (web3 !== null) return

    const currentProvider = this.getWeb3Provider()
    if (! currentProvider) {
      log.info('Could not get a valid provider for web3')
      return false
    }

    log.info('Instantiating contracts')
    web3 = new Web3(currentProvider)

    this.setContracts(contracts)

    this.setAddress(defaultAccount || web3.eth.accounts[0])

    if (! this.getAddress()) {
      log.warn('Could not get the default address from web3')
      return false
    }

    log.info(`Got ${this.getAddress()} as current user address`)
    return true
  },

  getContract(name) {
    if (! this.contracts[name]) throw new Error(`The contract ${name} not found. Did you add it to the '.connect()' call?`)
    return this.contracts[name]
  },

  setContracts(contracts) {
    for (let contract of contracts) {
      contract = (contract instanceof Contract) ? contract : new Contract(contract)

      const instance = web3.eth.contract(contract.abi).at(contract.address)
      contract.setInstance(instance)

      this.contracts[contract.name] = contract
    }
  },

  getWeb3Provider() {
    const providerURL = env.getEnv('WEB3_HTTP_PROVIDER', 'http://localhost:8545')
    return new Web3.providers.HttpProvider(providerURL)
  },

  unlockAccount() {
    return web3.personal.unlockAccount(
      web3.eth.defaultAccount,
      env.getEnv('WEB3_ACCOUNT_PASSWORD', '')
    )
  },

  fetchTxStatus(txId) {
    log.info(`Getting ${txId} status`)
    return Contract.transaction(web3.eth.getTransaction, txId)
  },

  async fetchTxReceipt(txId) {
    log.info(`Getting ${txId} recepeit`)
    const recepeit = await Contract.transaction(web3.eth.getTransactionReceipt, txId)

    if (recepeit) {
      recepeit.logs = Contract.decodeLogs(recepeit.logs)
    }

    return recepeit
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

  findParamValue(decodedMethod, paramName) {
    // { "name": "methodName",
    //   "params": [{ "name": "paramName", "value": "3.6858e+22", "type": "uint256" }] }
    const params = decodedMethod.params || []
    const param = params.find(param => param.name === paramName)

    if (param) {
      return this.fromWei(param.value)
    }
  }
}
