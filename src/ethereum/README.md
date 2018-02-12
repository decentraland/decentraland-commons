
# Ethereum

Set of utility functions to work with the Ethereum blockchain.

Calling `eth.connect()` should be enough to get you going. If you want to customize this this behaviour, you can check the breakdown below.

Implementations for all important Decentraland contracts live on the `/contracts` folder. An example of its use can be found below.

### index.js

Main API to interface with web3. Acts as a global singleton and must be connected before calling any other method

```javascript
import { eth } from 'ethereum'
import { Contract } from 'Contract'

class SuperTokenContract extends Contract {
  static getDefaultAddress() {
    return env.universalGet('0xe2a10f'),
  }

  static getDefaultAbi() {
    return [{
        name: "method",
        type: "function"
    }]
  }
}

// null is the default account here
eth.connect({
  contracts: [
    { name: 'ContractName', address: '0x221100', abi: [{}] },
    // or
    SuperTokenContract,
    // or
    new SuperTokenContract()
  ]
})

eth.fetchTxStatus('TX_HASH')
```

### Contract

An interface to work with Ethereum contracts, takes care of decoding contract data and of calls/transactions.

```javascript
import { Contract } from 'Contract'
import { abi } from './abis/MANAToken.json'

const contract = new Contract('0xdeadbeef', abi)

await contract.call('allowance', sender, receiver)
await contract.transaction('lockMana', manaValue)
```


### txUtils.js

A set of common utility functions to work with transactions

```javascript
import { txUtils } from 'txUtils'

const status = eth.fetchTxStatus('TX_HASH')

if (txUtils.isPending(status)) {
    // something
}
```

## Putting it all together

The idea is to define your own `Contract`s and work with them using `eth`. A typical case is described below:

_MANAToken.js_

```javascript
import { eth } from 'decentraland-commons'

import { abi } from './artifacts/MANAToken.json'

class MANAToken extends eth.Contract {
    static getDefaultAddress() {
      return '0xdeadbeef'
    }

    static getDefaultAbi() {
      return abi
    }

    async lockMana(sender, mana) {
     return await this.transaction(
          'lockMana', sender, mana, { gas: 120000 }
      )
    }
}

export default MANAToken
```


_On the start of your app, maybe server.js_

```javascript
import { eth } from 'decentraland-commons'
import { MANAToken } from 'decentraland-commons/contracts'

eth.connect({
  contracts: [
    MANAToken,
      // ...etc
  ]
})

const manaToken = eth.getContract('MANAToken')
manaToken.lockMana()

// or maybe

const manaToken = new ManaToken(/*address*/, /*abi*/)
eth.connect({
  contracts: [
      manaToken,
      // ...etc
  ]
})
manaToken.lockMana()
```

