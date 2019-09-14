// Imports:
const chalk = require('chalk')

// Exports:
module.exports = function check(data) {
  const files = {}
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      const location = file.output.location
      const addedFile = files[location]

      if (addedFile) {
        const first = []
        const second = []

        if (file.meta.filename) {
          first.push('filename: ' + file.meta.filename)
        }

        if (file.meta.title) {
          first.push('title: ' + file.meta.title)
        }

        if (addedFile.meta.filename) {
          second.push('filename: ' + addedFile.meta.filename)
        }

        if (addedFile.meta.title) {
          second.push('title: ' + addedFile.meta.title)
        }

        console.error(chalk.red('ERROR: ') + 'More than one file exists with the same output filename, aborting!\n')
        console.error('-> ' + file.input.location + ' (' + first.join(', ') + ')')
        console.error('-> ' + addedFile.input.location + ' (' + second.join(', ') + ')')
    
        process.exit(1)
      }
  
      files[location] = file
  
      filesRead++
  
      if (filesRead === totalFiles) {
        resolve(data)
      }
    }
  })  
}