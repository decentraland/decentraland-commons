import Web3 from "web3";

import { Log } from "../log";
import * as env from "../env";

import Contract from "./Contract";

const log = new Log("[Ethrereum]");
let web3 = null;

/** @namespace */
const eth = {
  contracts: {}, // Filled on .connect()

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: require("./ethUtils"),

  /**
   * Connect to web3
   * @param  {string} [defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use. By default will use the available contracts.
   * @return {boolean} - True if the connection was successful
   */
  connect(defaultAccount, contracts) {
    if (web3 !== null) return;

    const currentProvider = this.getWeb3Provider();
    if (!currentProvider) {
      log.info("Could not get a valid provider for web3");
      return false;
    }

    log.info("Instantiating contracts");
    web3 = new Web3(currentProvider);

    this.setAddress(defaultAccount || web3.eth.accounts[0]);
    this.setContracts(contracts || this._getDefaultContracts());

    if (!this.getAddress()) {
      log.warn("Could not get the default address from web3");
      return false;
    }

    log.info(`Got ${this.getAddress()} as current user address`);
    return true;
  },

  // Internal. Dynamic require
  _getDefaultContracts() {
    return [require("./MANAToken"), require("./TerraformReserve")];
  },

  getContract(name) {
    if (!this.contracts[name]) {
      throw new Error(
        `The contract ${name} not found. Did you add it to the '.connect()' call?`
      );
    }

    return this.contracts[name];
  },

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * Usable later via `.getContract`
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use.
   */
  setContracts(contracts) {
    for (let contract of contracts) {
      contract = Contract.isPrototypeOf(contract)
        ? contract.getInstance()
        : new Contract(contract);

      const instance = web3.eth.contract(contract.abi).at(contract.address);
      contract.setInstance(instance);

      this.contracts[contract.name] = contract;
    }
  },

  getWeb3Provider() {
    return process.browser
      ? window.web3 && window.web3.currentProvider
      : new Web3.providers.HttpProvider(
          env.getEnv("WEB3_HTTP_PROVIDER", "http://localhost:8545")
        );
  },

  unlockAccount() {
    return web3.personal.unlockAccount(
      this.getAddress(),
      env.getEnv("WEB3_ACCOUNT_PASSWORD", "")
    );
  },

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus(txId) {
    log.info(`Getting ${txId} status`);
    return Contract.transaction(web3.eth.getTransaction, txId);
  },

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction recepeit (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    log.info(`Getting ${txId} recepeit`);
    const recepeit = await Contract.transaction(
      web3.eth.getTransactionReceipt,
      txId
    );

    if (recepeit) {
      recepeit.logs = Contract.decodeLogs(recepeit.logs);
    }

    return recepeit;
  },

  async remoteSign(message, address) {
    const sign = web3.personal.sign.bind(web3.personal);
    return await Contract.transaction(sign, message, address);
  },

  async remoteRecover(message, signature) {
    return await web3.personal.ecRecover(message, signature);
  },

  setAddress(address) {
    web3.eth.defaultAccount = address;
  },

  getAddress() {
    return web3.eth.defaultAccount;
  }
};

module.exports = eth;
