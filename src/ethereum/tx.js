import { Log } from '../log'
import { sleep } from '../utils'

import eth from './index'

const log = new Log('[tx]')

const tx = {
  DUMMY_TX_ID: '0xdeadbeef',

  async waitUntilComplete(hash) {
    const retry = () => {
      log.info(`Transaction ${hash} pending, retrying later`)
      return sleep(1000 * 60).then(() => this.whenComplete(hash))
    }

    const { tx, recepeit } = await this.getFull(hash)

    if (this.isPending(tx) || !recepeit) return retry()

    log.info(`Transaction ${hash} completed`)
    return { tx, recepeit }
  },

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
