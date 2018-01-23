'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postgres = require('./postgres');

Object.defineProperty(exports, 'postgres', {
  enumerable: true,
  get: function get() {
    return _postgres.postgres;
  }
});

var _mongo = require('./mongo');

Object.defineProperty(exports, 'mongo', {
  enumerable: true,
  get: function get() {
    return _mongo.mongo;
  }
});