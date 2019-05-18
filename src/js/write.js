// Requires:
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
const slugify = require('slugify')

// Exports:
module.exports = function write(files, args) {
  console.log('')

  for (let file of files) {
    if (!file.data.title) {
      console.error('\nNo title contained in the metadata for ' + file.path + ', aborting!')

      process.exit(1)
    }
    
    const filename = args.output + '/' + slugify(file.data.title).toLowerCase() + '.html'

    let data = file.markdown

    const header = new Promise((resolve) => {
      if (args.header) {
        fs.readFile(args.header, args.encoding, (error, header) => {
          if (error) {
            console.error(error)
  
            process.exit(1)
          }
  
          data = header + data

          resolve()
        })
      } else {
        resolve()
      }
    })

    const footer = new Promise((resolve) => {
      if (args.footer) {  
        fs.readFile(args.footer, args.encoding, (error, footer) => {
          if (error) {
            console.error(error)
  
            process.exit(1)
          }
  
          data = data + footer

          resolve()
        })
      } else {
        resolve()
      }
    })

    Promise.all([header, footer]).then(() => {
      console.log('Writing ' + filename + ' (' + prettyBytes(file.markdown.length) + ')')

      fs.writeFile(filename, data, (error) => {
        if (error) {
          console.error(error)
  
          process.exit(1)
        }
      })  
    })
  }
}