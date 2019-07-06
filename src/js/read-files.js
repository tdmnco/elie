// Requires:
const fs = require('fs')
const glob = require('glob')
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
    glob(input, function(error, files) {
      if (error) {
        console.error(error)
  
        process.exit(1)
      }

      if (files.length === 0) {
        console.error('No files to read in ' + input + ', aborting!')

        process.exit(1)
      }
  
      totalFiles = files.length
      
      for (let index in files) {
        const path = files[index]
        const split = path.split('/')

        split.pop()

        const directory = split.join('/')
  
        fs.readFile(path, args.encoding, (error, content) => {
          process.stdout.write('Processing ' + path)

          if (error) {
            console.error(error)
  
            process.exit(1)
          }

          const data = { content, directory, path }
          const bytes = data.content.length
  
          totalBytes += bytes
  
          readCount++
  
          filesRead.push(data)

          process.stdout.write(' (' + prettyBytes(bytes) + ')...\n')
  
          if (readCount === totalFiles) {
            console.log('\n' + totalFiles + ' file' + (totalFiles !== 1 ? 's' : '') + ' read (' + prettyBytes(totalBytes) + ')\n')
  
            resolve(filesRead)
          }        
        })
      }
    })
  })
}