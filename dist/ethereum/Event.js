'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Event class */
var Event = exports.Event = function () {
  function Event(contract, eventName) {
    _classCallCheck(this, Event);

    this.contract = contract;
    this.name = eventName;

    if (!this.instance) {
      throw new Error('Could not find event "' + eventName + '" for ' + contract.constructor.getContractName() + ' contract');
    }
  }

  _createClass(Event, [{
    key: 'watch',


    /**
     * Register a callback for each time this event appears for the contract
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.args] - Indexed return values you want to filter the logs by
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */
    value: function watch(options, callback) {
      var _ref = typeof options === 'function' ? {} : options,
          args = _ref.args,
          opts = _ref.opts;

      var func = typeof options === 'function' ? options : callback;
      this.instance(args, opts).watch(func);
    }

    /**
     * Get all the historical events
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.args] - Indexed return values you want to filter the logs by
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */

  }, {
    key: 'getAll',
    value: function getAll(options, callback) {
      var _ref2 = typeof options === 'function' ? {} : options,
          args = _ref2.args,
          opts = _ref2.opts;

      var func = typeof options === 'function' ? options : callback;
      this.instance(args, opts).get(func);
    }
  }, {
    key: 'instance',
    get: function get() {
      return this.contract.instance[this.name];
    }
  }]);

  return Event;
}();