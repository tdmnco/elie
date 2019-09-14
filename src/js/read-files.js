// Requires:
const chalk = require('chalk')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const prettyBytes = require('pretty-bytes')

// Exports:
module.exports = function readFiles(args) {
  const filesRead = []

  let input = args.input
  let readCount = 0
  let totalBytes = 0
  let totalFiles = 0

  if (input.slice(-3) !== '.md') {
    input = input + '/**/*.md'
  }

  return new Promise((resolve) => {
    glob(path.join(input), function(error, files) {
      if (error) {
        console.error(chalk.red('ERROR: ') + error)
  
        process.exit(1)
      }

      if (files.length === 0) {
        console.error(chalk.red('ERROR: ') + 'No files to read in ' + input + ', aborting!')

        process.exit(1)
      }
  
      totalFiles = files.length
      
      for (let index in files) {
        const location = files[index]
        const split = location.split('/')

        split.pop()

        const directory = split.join('/')
  
        fs.readFile(path.join(location), args.encoding, (error, content) => {
          process.stdout.write('Processing ' + location)

          if (error) {
            console.error(chalk.red('ERROR: ') + error)
  
            process.exit(1)
          }

          const data = { content, input: { directory, location } }
          const bytes = data.content.length
  
          totalBytes += bytes
  
          readCount++
  
          filesRead.push(data)

          process.stdout.write(' (' + prettyBytes(bytes) + ')...\n')
  
          if (readCount === totalFiles) {
            console.log('\n' + chalk.green('OK: ') + totalFiles + ' file' + (totalFiles !== 1 ? 's' : '') + ' read (' + prettyBytes(totalBytes) + ')\n')
  
            resolve(filesRead)
          }        
        })
      }
    })
  })
}