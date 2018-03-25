import { Log } from '../log'

import { NodeWallet, LedgerWallet } from './wallets'
import { EmptyContract } from './Contract'
import { Abi } from './abi'
import { ethUtils } from './ethUtils'
import { promisify } from '../utils/index'

const log = new Log('Ethereum')
let web3 = null

export type ConnectOptions = {
  /** An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts} */
  contracts?: any[]
  /** Override the default account address */
  defaultAccount?: any
  /** URL for a provider forwarded to {@link Wallet#getWeb3Provider} */
  providerUrl?: string
  derivationPath?: string
}

export namespace eth {
  /**
   * Filled on .connect()
   */
  export let contracts = {}
  export let wallet = null

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  export const utils = ethUtils

  /**
   * Connect to web3
   * @param  {object} [options] - Options for the ETH connection
   * @param  {array<Contract>} [options.contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts}
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.providerUrl] - URL for a provider forwarded to {@link Wallet#getWeb3Provider}
   * @param  {string} [options.derivationPath] - Path to derive the hardware wallet in. Defaults to each wallets most common value
   * @return {boolean} - True if the connection was successful
   */
  export async function connect(options: ConnectOptions = {}) {
    if (isConnected()) {
      disconnect()
    }

    const { contracts = [], defaultAccount, providerUrl, derivationPath } = options

    try {
      wallet = await connectWallet(defaultAccount, providerUrl, derivationPath)
      web3 = wallet.getWeb3()

      setContracts(contracts)

      return true
    } catch (error) {
      log.info(`Error trying to connect Ethereum wallet: ${error.message}`)
      return false
    }
  }

  export async function connectWallet(defaultAccount, providerUrl = '', derivationPath = null) {
    let wallet
    const networks = getNetworks()

    try {
      const network = networks.find(network => providerUrl.includes(network.name)) || networks[0]

      wallet = new LedgerWallet(defaultAccount, derivationPath)
      await wallet.connect(providerUrl, network.id)
    } catch (error) {
      wallet = new NodeWallet(defaultAccount)
      await wallet.connect(providerUrl)
    }

    return wallet
  }

  export function isConnected() {
    return (wallet && wallet.isConnected()) || !!web3
  }

  export function disconnect() {
    if (wallet) {
      wallet.disconnect()
    }
    wallet = null
    contracts = {}
    web3 = null
  }

  export function getAddress() {
    return getAccount()
  }

  export function getAccount() {
    return wallet.getAccount()
  }

  export function getWalletAttributes() {
    return {
      account: wallet.account,
      type: wallet.type,
      derivationPath: wallet.derivationPath
    }
  }

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/commons/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} contracts - An array comprised of a wide variety of options: objects defining contracts, Contract subclasses or Contract instances.
   */
  export function setContracts(contracts) {
    if (!isConnected()) {
      throw new Error('Tried to set eth contracts without connecting successfully first')
    }

    for (const contractData of contracts) {
      let contract = null
      let contractName = null

      if (typeof contractData === 'function') {
        // contractData is subclass of Contract
        contract = new contractData()
        contractName = contractData.getContractName()
      } else if (typeof contractData === 'object' && contractData.constructor !== Object) {
        // contractData is an instance of Contract or of one of its subclasses
        contract = contractData
        contractName = contractData.constructor.getContractName()
      } else {
        // contractData is an object defining the contract
        contract = new EmptyContract(contractData)
        contractName = contractData.name
      }

      if (!contractName) continue // skip

      const instance = wallet.createContractInstance(contract.abi, contract.address)
      contract.setInstance(instance)

      contracts[contractName] = contract
    }
  }

  /**
   * Get a contract instance built on {@link eth#setContracts}
   * It'll throw if the contract is not found on the `contracts` mapping
   * @param  {string} name - Contract name
   * @return {object} contract
   */
  export function getContract(name: string) {
    if (!contracts[name]) {
      const contractNames = Object.keys(contracts)
      throw new Error(
        `The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are "${contractNames}"`
      )
    }

    return contracts[name]
  }

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  export async function fetchTxStatus(txId) {
    return promisify(web3.eth.getTransaction)(txId)
  }

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  export async function fetchTxReceipt(txId) {
    const receipt = await promisify(web3.eth.getTransactionReceipt)(txId)

    if (receipt && receipt['logs']) {
      receipt['logs'] = Abi.decodeLogs(receipt['logs'])
    }

    return receipt
  }

  export async function sign(payload) {
    const message = utils.toHex(payload)
    const signature = await wallet.sign(message)
    return { message, signature }
  }

  export async function recover(message, signature) {
    return wallet.recover(message, signature)
  }

  /**
   * Get a list of known networks
   * @return {array} - An array of objects describing each network: { id, name, label }
   */
  export function getNetworks() {
    return [
      {
        id: '1',
        name: 'mainnet',
        label: 'Main Ethereum Network'
      },
      {
        id: '2',
        name: 'morden',
        label: 'Morden Test Network'
      },
      {
        id: '3',
        name: 'ropsten',
        label: 'Ropsten Test Network'
      },
      {
        id: '4',
        name: 'rinkeby',
        label: 'Rinkeby Test Network'
      },
      {
        id: '42',
        name: 'kovan',
        label: 'Kovan Test Network'
      }
    ]
  }

  /**
   * Interface for the web3 `getNetwork` method (it adds the network name and label).
   * @return {object} - An object describing the current network: { id, name, label }
   */
  export async function getNetwork() {
    const id = await promisify(web3.version.getNetwork)()
    const networks = getNetworks()
    const network = networks.find(network => network.id === id)
    if (!network) {
      throw new Error('Unknown Network')
    }
    return network
  }
}
