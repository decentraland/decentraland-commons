#!/usr/bin/env babel-node

import program from 'commander'

import { Manifest } from './Manifest'
import { Artifacts } from './Artifacts'
import { IndexFile } from './IndexFile'
import { Formatter } from './Formatter'

export function main() {
  program
    .command('generate-manifest')
    .option(
      '--folderPath [folderPath]',
      'Folder containing the contract files. By default it will try to find the nearest src/contracts folder'
    )
    .option(
      '--write',
      'Whether write the file or just print it. Defaults to false',
      false
    )
    .action(async options => {
      const manifest = new Manifest(options.folderPath)
      const indexFile = await generateIndex(manifest)

      if (options.write) {
        await manifest.write(indexFile)
        console.log(`index file written on "${manifest.folderPath}"`)
      } else {
        console.log(indexFile)
      }
    })

  program
    .command('trim-artifacts')
    .option(
      '--folderPath [folderPath]',
      'Folder containing the contract files. By default it will try to find the nearest src/contracts folder'
    )
    .option(
      '--write',
      'Whether write the file or just print it. Defaults to false',
      false
    )
    .action(async options => {
      const artifacts = new Artifacts(options.folderPath)
      await artifacts.buildCollection()

      console.log(`Trimming artifacts on ${artifacts.folderPath}`)

      if (options.write) {
        await artifacts.write()
        console.log(`artifacts written on "${artifacts.folderPath}"`)
      } else {
        const content = await artifacts.trim()
        console.log(content)
      }
    })

  program.parse(process.argv)
}

async function generateIndex(manifest) {
  console.log(`Geneating manifest for "${manifest.folderPath}"`)

  const contractPaths = await manifest.getPaths()

  console.log(`Found ${contractPaths.length} contracts`)
  console.log('Building index file')

  const index = new IndexFile(contractPaths)
  const indexFile = index.build()

  console.log('Index built successufully')

  return new Formatter().format(indexFile)
}

if (require.main === module) {
  main()
}
