import program from 'commander'
import inquirer from 'inquirer'


/**
 * Runs a set of different clients. Useful to split functionalities and lower boilerplate code
 * @param {array} clients - An array of objects that implement the `addCommand method`
 */
export function runProgram(clients) {
  for (const client of clients) {
    if (typeof client.addCommands !== 'function') {
      throw new Error('Each client supplied to `runProgram` must implement the `addCommands` function')
    }

    client.addCommands(program)
  }

  if (! process.argv.slice(2).length) {
    program.outputHelp()
    process.exit()
  }

  program.parse(process.argv)
}


/**
 * Query the user for a boolean result
 * @param {string=Are you sure?} text - The text to show to the user
 * @param {boolean=true} defaultAnswer - The value for the default answer
 */
export default async function confirm(text = 'Are you sure?', defaultAnswer = false) {
  const res = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: text,
    default: defaultAnswer
  })

  return res.confirm
}
