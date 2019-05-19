// Requires:
const fs = require('fs')
const glob = require('glob')
const parse = require('./parse')
const prettyBytes = require('pretty-bytes')

// Exports:
module.exports = function readFiles(args) {
  const parsed = []

  let totalBytes = 0
  let totalFiles = 0
  let filesRead = 0

  return new Promise((resolve) => {
    glob(args.input + '/*.md', function(error, files) {
      if (error) {
        console.error(error)
  
        process.exit(1)
      }
  
      totalFiles = files.length
      
      for (let index in files) {
        const file = files[index]
  
        fs.readFile(file, args.encoding, (error, data) => {
          process.stdout.write('Processing ' + file)

          if (error) {
            console.error(error)
  
            process.exit(1)
          }
  
          data = parse(data)

          data.path = file
  
          const bytes = data.bytes
  
          totalBytes += bytes
  
          filesRead++
  
          parsed.push(data)

          process.stdout.write(' (' + prettyBytes(bytes) + ')...')
  
          if (filesRead === totalFiles) {
            console.log('\n' + totalFiles + ' files read (' + prettyBytes(totalBytes) + ')\n')
  
            resolve(parsed)
          }        
        })
      }
    })
  })
}