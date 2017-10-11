# Cli

Simple helper functions for creating a cli interface

### `runProgram` Usage

`runProgram` allows for reduced boilerplate code and better separation of concerns between the cli functions.
An example usage migth be:

**index.js**

```javascript
#!/usr/bin/env babel-node

import { runProgram } from 'decentraland-commons/cli'

import itemsCli from './itemsCli'
import locationsCli from './locationsCli'

db.connect()
    .then(() =>
      runProgram([
        itemsCli,
        locationsCli
      ])
    )
```

**itemsCli.js**

```javascript
export default {
    addCommands(program) {
        program.addCommand(/* do something */)
    }
}
```

and a similar situation for **locationsCli.js**
