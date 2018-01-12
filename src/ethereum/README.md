
# Ethereum

Set of utility functions to work with the Ethereum blockchain.

By default `eth.js` will load up all contracts on the `/contracts` folder and choose a default account for you. So calling `eth.connect()` should be enough.

If you want to change this behaviour, you can check the breakdown below.

It can be used in conjunction to [decentraland-contracts](https://github.com/decentraland/contracts)

### index.js

Main API to interface with web3. Acts as a global singleton and must be connected before calling any other method

```javascript
import eth from 'ethereum'
import Contract from 'Contract'

class SuperTokenContract extends Contract {
  static getInstance() {
    return new Contract({ name: 'LAND', address: '0xe2a10f', abi: {} })
  }
}

// null is the default account here
eth.connect(null, [
    { name: 'MANAToken', address: '0x221100', abi: {} },
    SuperTokenContract
])

eth.fetchTxStatus('TX_HASH')
```

### Contract

An interface to work with Ethereum contracts, takes care of decoding contract data and of calls/transactions.

```javascript
import Contract from 'Contract'
import { abi } from './abis/MANAToken.json'

const contract = new Contract('MANAToken', '0xdeadbeef', abi)

await contract.call('allowance', sender, receiver)
await contract.transaction('lockMana', manaValue)
```


### tx.js

A set of common utility functions to work with transactions

```javascript
import tx from 'tx'

const status = eth.fetchTxStatus('TX_HASH')

if (tx.isPending(status)) {
    // something
}
```

## Putting it all together

The idea is to define your own `Contract`s and work with them using `eth`. A typical case is described below:

Check [decentraland-contracts](https://github.com/decentraland/contracts) for more info.
