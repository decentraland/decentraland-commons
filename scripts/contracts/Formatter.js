import fs from 'fs'
import prettier from 'prettier'

import { walkUp } from './utils'

export class Formatter {
  format(text) {
    return prettier.format(text, this.getPrettierOptions())
  }

  getPrettierOptions() {
    let eslintRules = null

    walkUp('.eslintrc', function(eslintrcPath) {
      if (fs.existsSync(eslintrcPath)) {
        const eslintrcText = fs.readFileSync(eslintrcPath, 'utf8')
        eslintRules = JSON.parse(eslintrcText).rules

        return true
      }
    })

    return eslintRules ? eslintRules['prettier/prettier'][1] : {}
  }
}
