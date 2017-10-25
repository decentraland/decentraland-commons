"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require("babel-polyfill");

module.exports = _extends({}, require("./ethereum"), {
  env: require("./env"),
  utils: require("./utils")
});