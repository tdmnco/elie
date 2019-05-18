// Requires:
const fs = require('fs')
const glob = require('glob')
const parse = require('./parse')
const prettyBytes = require('pretty-bytes')

// Constants:
const parsed = []

// Variables:
let totalBytes = 0
let totalFiles = 0
let filesRead = 0

// Exports:
module.exports = function read(args) {
  console.log('Opening path ' + args.input + '/*.md\n')

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
          if (error) {
            console.error(error)
  
            process.exit(1)
          }
  
          data = parse(data)

          data.path = file
  
          const bytes = data.bytes
  
          totalBytes += bytes
  
          process.stdout.write('Processing ' + file + ' (' + prettyBytes(bytes) + ')... ✅\n')
  
          filesRead++
  
          parsed.push(data)
  
          if (filesRead === totalFiles) {
            console.log('\n' + totalFiles + ' files read (' + prettyBytes(totalBytes) + ')')
  
            resolve(parsed)
          }        
        })
      }
    })
  })
}