import * as program from 'commander'
import inquirer from 'inquirer'

/**
 * Runs a set of different clients. Useful to split functionalities and lower boilerplate code
 * @param {array} clients - An array of objects that implement the `addCommand method`
 */
export function runProgram(clients) {
  for (const client of clients) {
    if (typeof client.addCommands !== 'function') {
      throw new Error(
        'Each client supplied to `runProgram` must implement the `addCommands` function'
      )
    }

    client.addCommands(program)
  }

  if (!process.argv.slice(2).length) {
    program.outputHelp()
    process.exit()
  }

  program.parse(process.argv)
}

/**
 * Query the user for a boolean result
 * @param {string} [text=Are you sure?]  - The text to show to the user
 * @param {boolean} [defaultAnswer=true] - The value for the default answer
 */
export async function confirm(
  text: string = 'Are you sure?',
  defaultAnswer = false
) {
  const res = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: text,
    default: defaultAnswer
  })

  return res.confirm
}

/**
 * Uses inquier {@link https://github.com/SBoudrias/Inquirer.js} to launch the prompt interface (inquiry session)
 * @param {Array} [questions = []] - questions containing Question Object {@link https://github.com/SBoudrias/Inquirer.js#objects}
 * @param {Promise} answers - A key/value hash containing the client answers in each prompt.
 */
export async function prompt(questions = []) {
  return inquirer.prompt(questions)
}
