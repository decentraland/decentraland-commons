// Interface
export class Wallet {
  constructor(account) {
    this.web3 = null
    this.account = null
  }

  isConnected() {
    return this.web3 && !!this.web3.eth
  }

  getWeb3() {
    return this.web3
  }

  getAccount() {
    return this.account
  }

  setAccount(account) {
    if (this.isConnected()) {
      this.web3.eth.defaultAccount = account
    }
    this.account = account
  }

  async connect() {
    throw new Error('Not implemented. Check wallet support')
  }

  disconnect() {
    this.web3 = null
    this.setAccount(null)
  }

  /**
   * Gets the appropiate Web3 provider for the given environment.
   * Check each implementation for in detail information
   * @param  {string} [providerURL] - URL for a provider.
   * @return {object} The web3 provider
   */
  async getProvider(providerUrl) {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Return available accounts for the current wallet
   * @return {Promise<array<string>>} accounts
   */
  async getAccounts() {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Creates a new contract instance with all its methods and events defined in its json interface object (abi).
   * @param  {object} abi     - Application Binary Interface.
   * @param  {string} address - Contract address
   * @return {object} instance
   */
  createContractInstance(abi, address) {
    return this.web3.eth.contract(abi).at(address)
  }

  /**
   * Unlocks the current account with the given password
   * @param  {string} password - Account password
   * @return {boolean} Whether the operation was successfull or not
   */
  unlockAccount(password) {
    return this.web3.personal.unlockAccount(this.account, password)
  }

  /**
   * Signs data from the default account
   * @param  {string} message - Message to sign, ussually in Hex
   * @return {Promise<string>} signature
   */
  async sign(message) {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Recovers the account that signed the data
   * @param  {string} message   - Data that was signed
   * @param  {string} signature
   * @return {Promise<string>} account
   */
  async recover(message, signature) {
    throw new Error('Not implemented. Check wallet support')
  }
}
