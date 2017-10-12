
# Ethereum

Set of utility functions to work with the Ethereum blockchain.

By default `eth.js` will load up all contracts on the `/contracts` folder and choose a default account for you. So calling `eth.connect()` should be enough.

If you want to change this behaviour, you can check the breakdown below.

### index.js

Main API to interface with web3. Acts as a global singleton and must be connected before calling any other method

```javascript
import eth from 'ethereum'

eth.connect([
    { name: 'MANAToken', address: '0x221100', abi: {} }
    new Contract({ name: 'LAND', address: '0xe2a10f', abi: {} })
])

eth.fetchTxStatus('TX_HASH')
```

### Contract

An interface to work with Ethereum contracts, takes care of decoding contract data and of calls/transactions

```javascript
import Contract from 'Contract'
import { abi } from '../contracts/MANAToken.json'

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

_MANAToken.js_

```javascript
import Contract from 'Contract'
import eth from 'eth'

import { abi } from '../contracts/MANAToken.json'


class MANAToken extends Contract {
    async lockMana(sender, mana) {
     return await this.transaction(
          'lockMana', sender, mana, { gas: 120000 }
      )
    }
}

export default new MANAToken('MANAToken', '0xdeadbeef', abi)
```


_On the start of your app, maybe server.js_

```javascript
import manaToken from './MANAToken'

// The null here is to preserve the default account as is
eth.connect(null, [
    manaToken,
    // ...etc
])

eth.getContract('MANAToken').lockMana()
// or
manaToken.lockMana()
```

