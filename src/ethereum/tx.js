import { Log } from '../log'
import { sleep } from '../utils'

import eth from './eth'

const log = new Log('tx')

/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
const tx = {
  DUMMY_TX_ID: '0xdeadbeef',

  /**
   * Wait until a transaction finishes by either being mined or failing
   * @param  {string} txId - Transaction id to watch
   * @return {object} data - Current transaction data
   * @return {object.tx} transaction - Transaction status
   * @return {object.recepeit} transaction - Transaction recepeit
   */
  async waitUntilComplete(txId) {
    const retry = () => {
      log.info(`Transaction ${txId} pending, retrying later`)
      return sleep(1000 * 60).then(() => this.whenComplete(txId))
    }

    const { tx, recepeit } = await this.getFull(txId)

    if (this.isPending(tx) || !recepeit) return retry()

    log.info(`Transaction ${txId} completed`)
    return { tx, recepeit }
  },

  /**
   * Get the transaction status and recepeit
   * @param  {string} txId - Transaction id
   * @return {object} data - Current transaction data
   * @return {object.tx} transaction - Transaction status
   * @return {object.recepeit} transaction - Transaction recepeit
   */
  async getFull(txId) {
    const [tx, recepeit] = await Promise.all([
      eth.fetchTxStatus(txId),
      eth.fetchTxReceipt(txId)
    ])

    return { tx, recepeit }
  },

  /**
   * Expects the result of getTransaction's geth command
   * and returns true if the transaction is still pending
   * @param {object} tx - The transaction object
   * @return boolean
   */
  isPending(tx) {
    if (!tx) return true
    return tx.blockNumber === null || tx.status === 'pending' // `status` is added by us
  },

  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} logs - The result of decoding the logs of the getTransaction's geth command
   * @param {Array<string>|string} names - A string or array of strings with event names you want to search for
   * @return boolean
   */
  hasLogEvents(logs, names) {
    if (!names || names.length === 0) return false
    if (!Array.isArray(names)) names = [names]

    logs = logs.filter(log => log && log.name)

    return logs.every(log => names.includes(log.name))
  }
}

module.exports = tx
