import Web3 from 'web3'

import { Log } from '../log'
import * as env from '../env'

import Contract from './Contract'
import MANAToken from './MANAToken'
import TerraformReserve from './TerraformReserve'


const log = new Log('[Ethrereum]')
let web3 = null


/** @namespace */
const eth = {
  contracts: {
    MANAToken,
    TerraformReserve
  },

  /**
   * Link to web3's BigNumber reference
   */
  BigNumber: Web3.utils && Web3.utils.BN,

  /**
   * Connect to web3
   * @param  {string} [defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {object|Contract} [contracts] - An array of objects defining contracts or Contract subclasses to use. By default will use the available contracts.
   * @return {boolean} - True if the connection was successful
   */
  connect(defaultAccount, contracts) {
    if (web3 !== null) return

    const currentProvider = this.getWeb3Provider()
    if (! currentProvider) {
      log.info('Could not get a valid provider for web3')
      return false
    }

    log.info('Instantiating contracts')
    web3 = new Web3(currentProvider)

    this.setAddress(defaultAccount || web3.eth.accounts[0])

    this.setContracts(contracts || this.contracts)

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
      contract = Contract.isPrototypeOf(contract) ? contract.getInstance() : new Contract(contract)

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

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus(txId) {
    log.info(`Getting ${txId} status`)
    return Contract.transaction(web3.eth.getTransaction, txId)
  },

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction recepeit (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    log.info(`Getting ${txId} recepeit`)
    const recepeit = await Contract.transaction(web3.eth.getTransactionReceipt, txId)

    if (recepeit) {
      recepeit.logs = Contract.decodeLogs(recepeit.logs)
    }

    return recepeit
  },

  /**
   * Converts a number of wei into the desired unit
   * @param  {number|BigNumber} amount - Amount to parse
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei} for more info
   * @return {string} - Parsed result
   */
  fromWei(amount, unit='ether') {
    amount = web3.toBigNumber(amount)
    return web3.fromWei(amount, unit).toNumber(10)
  },

  /**
   * Converts an ethereum unit into wei
   * @param  {number|BigNumber} amount - Amount to convert
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
   * @return {string} - Parsed result
   */
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
  }
}

module.exports = eth
