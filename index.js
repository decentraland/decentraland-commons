module.exports = {
  env: require('./env'),
  eth: require('./eth'),
  log: require('./log'),
  cli: require('./cli'),
  contracts: {
    MANA: require('./contracts/MANAToken.json')
  },
  email: require('./email'),
  utils: require('./utils')
}
