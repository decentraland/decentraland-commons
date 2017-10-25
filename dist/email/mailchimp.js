"use strict";

var _mailchimpApiV = require("mailchimp-api-v3");

var _mailchimpApiV2 = _interopRequireDefault(_mailchimpApiV);

var _log = require("../log");

var _env = require("../env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = new _log.Log("[Mailchimp]");

/**
 * Mailchimp client, uses `mailchimp-api-v3` behind the scenes. Check {@link https://developer.mailchimp.com/} for more info.
 * @namespace
 */
var mailchimp = {
  client: null, // defined on `.connect()`

  /**
   * Connect to the mailchimp client
   * @return {object} the mailchimp object, to allow chaining
   */
  connect: function connect() {
    if (this.client) {
      var MAILCHIMP_API_KEY = (0, _env.getEnv)("MAILCHIMP_API_KEY");
      this.client = new _mailchimpApiV2.default(MAILCHIMP_API_KEY);
    }

    return this;
  },


  /**
   * Register a user to a Mailchimp list.
   * @param  {string} email  - User email
   * @param  {string} [listId] - The list you want to register the user to. It'll try to use MAILCHIMP_LIST_ID if it's not defined
   * @return {Promise<boolean>} - True if the operation was successfull
   */
  subscribe: function subscribe(email, listId) {
    if (!listId) {
      listId = (0, _env.getEnv)("MAILCHIMP_LIST_ID", function () {
        throw new Error("Missing Mailchimp List Id: MAILCHIMP_LIST_ID");
      });
    }

    return undefined.client.post("/lists/" + listId + "/members", {
      email_address: email,
      status: "subscribed"
    }).then(function (response) {
      if (response.error) {
        return false;
      }

      log.info("Subscribed " + email + " to list " + listId);
      return true;
    }).catch(function (error) {
      if (error.title === "Member Exists") {
        return true;
      }

      log.error("Error trying to subscribe " + email + " to list " + listId, error);
      return false;
    });
  }
};

module.exports = mailchimp;