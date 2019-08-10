// Requires:
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const prettyBytes = require('pretty-bytes')

// Exports:
module.exports = function readTemplates(args) {
  const templatesRead = {}
  
  let readCount = 0
  let templates = args.templates
  let totalBytes = 0
  let totalFiles = 0

  if (templates.slice(-3) !== '.html') {
    templates = templates + '/**/*.html'
  }

  return new Promise((resolve) => {
    glob(path.join(templates), function(error, files) {
      if (error) {
        console.error(error)
  
        process.exit(1)
      }

      if (files.length === 0) {
        console.error('No templates to read in ' + templates + ', aborting!')

        process.exit(1)
      }
  
      totalFiles = files.length
      
      for (let index in files) {
        const location = files[index]
        const split = location.split('/')
        const filename = split[split.length - 1]
        const name = filename.split('.')[0]

        split.pop()

        const directory = split.join('/')
  
        fs.readFile(path.join(location), args.encoding, (error, content) => {
          process.stdout.write('Processing ' + location)

          if (error) {
            console.error(error)
  
            process.exit(1)
          }

          const data = { content, input: { directory, filename, location } }
          const bytes = data.content.length

          totalBytes += bytes
  
          readCount++
  
          templatesRead[name] = data

          process.stdout.write(' (' + prettyBytes(bytes) + ')...\n')
  
          if (readCount === totalFiles) {
            console.log('\n' + totalFiles + ' file' + (totalFiles !== 1 ? 's' : '') + ' read (' + prettyBytes(totalBytes) + ')\n')
  
            resolve(templatesRead)
          }        
        })
      }
    })
  })
}