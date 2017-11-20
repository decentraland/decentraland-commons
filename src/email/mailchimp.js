import Mailchimp from 'mailchimp-api-v3'

import { Log } from '../log'

const log = new Log('[Mailchimp]')

/**
 * Mailchimp client, uses `mailchimp-api-v3` behind the scenes. Check {@link https://developer.mailchimp.com/} for more info.
 * @namespace
 */
const mailchimp = {
  client: null, // defined on `.connect()`

  /**
   * Connect to the Mailchimp client
   * @param {string} apiKey - Mailchimp api key
   * @return {object} the Mailchimp object, to allow chaining
   */
  connect(apiKey) {
    if (!apiKey) throw new Error('Missing Mailchimp API key')

    if (!this.client) {
      this.client = new Mailchimp(apiKey)
    }

    return this
  },

  /**
   * Register a user to a Mailchimp list.
   * @param  {string} email  - User email
   * @param  {string} listId - The list you want to register the user to
   * @return {Promise<boolean>} - True if the operation was successfull
   */
  subscribe: (email, listId) => {
    if (!listId) {
      throw new Error('Missing Mailchimp List Id')
    }

    return this.client
      .post(`/lists/${listId}/members`, {
        email_address: email,
        status: 'subscribed'
      })
      .then(function(response) {
        if (response.error) {
          return false
        }

        log.info(`Subscribed ${email} to list ${listId}`)
        return true
      })
      .catch(error => {
        if (error.title === 'Member Exists') {
          return true
        }

        log.error(`Error trying to subscribe ${email} to list ${listId}`, error)
        return false
      })
  }
}

module.exports = mailchimp
