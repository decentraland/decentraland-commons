import { Log } from '../log'
import { sleep } from '../utils'
import { eth } from './eth'

const log = new Log('txUtils')

/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
export namespace txUtils {
  export let DUMMY_TX_ID = '0xdeadbeef'

  export let TRANSACTION_FETCH_DELAY = 10 * 1000

  export let TRANSACTION_STATUS = Object.freeze({
    pending: 'pending',
    confirmed: 'confirmed',
    failed: 'failed'
  })

  /**
   * Waits until the transaction finishes. Returns if it was successfull.
   * Throws if the transaction fails or if it lacks any of the supplied events
   * @param  {string} txId - Transaction id to watch
   * @param  {Array<string>|string} events - Events to watch. See {@link txUtils#getLogEvents}
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function getConfirmedTransaction(txId, events) {
    const tx = await waitForCompletion(txId)

    if (this.isFailure(tx)) {
      throw new Error(`Transaction "${txId}" failed`)
    }

    if (!this.hasLogEvents(tx, events)) {
      throw new Error(`Missing events for transaction "${txId}": ${events}`)
    }

    return tx
  }

  /**
   * Wait until a transaction finishes by either being mined or failing
   * @param  {string} txId - Transaction id to watch
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function waitForCompletion(txId) {
    const tx = await this.getTransaction(txId)

    if (this.isPending(tx) || !tx.recepeit) {
      log.debug(`"${txId}" pending, wait ${this.TRANSACTION_FETCH_DELAY}ms`)
      await sleep(this.TRANSACTION_FETCH_DELAY)
      return this.waitForCompletion(txId)
    }

    log.debug(`"${txId}" completed`)
    return tx
  }

  /**
   * Get the transaction status and recepeit
   * @param  {string} txId - Transaction id
   * @return {object} data - Current transaction data. See {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransaction}
   * @return {object.recepeit} transaction - Transaction recepeit
   */
  export async function getTransaction(txId) {
    const [tx, recepeit] = await Promise.all([
      eth.fetchTxStatus(txId),
      eth.fetchTxReceipt(txId)
    ])

    return { ...tx, recepeit }
  }

  /**
   * Expects the result of getTransaction's geth command and returns true if the transaction is still pending.
   * It'll also check for a pending status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export async function isPending(tx) {
    return (
      tx &&
      (tx.blockNumber === null || tx.status === this.TRANSACTION_STATUS.pending)
    )
  }

  /**
   * Expects the result of getTransactionRecepeit's geth command and returns true if the transaction failed.
   * It'll also check for a failed status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export async function isFailure(tx) {
    return (
      tx &&
      (!tx.recepeit ||
        tx.recepeit.status === '0x0' ||
        tx.status === this.TRANSACTION_STATUS.failed)
    )
  }

  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} tx - Transaction with a decoded recepeit
   * @param {Array<string>|string} eventNames - A string or array of strings with event names you want to search for
   * @return boolean
   */
  export async function hasLogEvents(tx, eventNames) {
    if (!eventNames || eventNames.length === 0) return true
    if (!tx.recepit) return false

    if (!Array.isArray(eventNames)) eventNames = [eventNames]

    return tx.recepeit
      .filter(log => log && log.name)
      .every(log => eventNames.includes(log.name))
  }
}
