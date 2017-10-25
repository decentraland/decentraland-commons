"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

module.exports = _extends({}, require("./ethereum"), require("./log"), require("./email"), {

  // Abi accessible using the `.abi` property
  contracts: {
    MANAToken: require("./ethereum/MANAToken"),
    TerraformReserve: require("./ethereum/TerraformReserve")
  },

  server: require("./server"),

  db: require("./db"),

  ssh: require("./ssh"),

  env: require("./env"),

  Model: require("./Model"),

  cli: require("./cli"),

  utils: require("./utils")
});