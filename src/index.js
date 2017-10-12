module.exports = {
  // Abi accessible using the `.abi` property
  contracts: {
    MANAToken: require('./ethereum/MANAToken'),
    TerraformReserve: require('./ethereum/TerraformReserve')
  },
  eth: require('./ethereum'),
  db: require('./db'),
  env: require('./env'),
  log: require('./log'),
  cli: require('./cli'),
  email: require('./email'),
  utils: require('./utils')
}
