// Requires:
const fs = require('fs')
const minify = require('html-minifier').minify;
const mkdirp = require('mkdirp')
const path = require('path')
const prettyBytes = require('pretty-bytes')
const slugify = require('slugify')

// Exports:
module.exports = function write(data) {
  const args = data.args
  const files = data.files
  
  let totalFiles = 0
  let writeCount = 0

  for (let file of files) {
    totalFiles += file.paginate.length
  }

  for (let file of files) {
    const title = file.meta.title

    let filename = file.meta.filename

    if (!filename && !title) {
      console.error('No filename or title contained in the metadata for ' + file.location + ', aborting!')

      process.exit(1)
    }
    
    let input = args.input

    if (input.slice(-3) === '.md') {
      const split = input.split('/')

      split.pop()

      input = split.join('/')
    }

    let directory = file.directory.replace(input, '')

    if (directory.slice(0, 1) === '/') {
      directory = directory.slice(1)
    }

    directory = args.output + '/' + directory

    mkdirp(path.join(directory), (error) => {
      if (error) {
        console.error(error)

        process.exit(1)
      }

      for (let paginate of file.paginate) {
        const page = paginate.page === 0 ? '' : '-' + paginate.page

        filename = path.join(directory + '/' + (slugify(file.meta.filename || file.meta.title).toLowerCase()) + page + '.html')

        let data = paginate.html
        
        if (args.minify || typeof args.minify === 'undefined') {
          data = minify(data, {
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true
          })
        }
        
        console.log('Writing ' + filename + ' (' + prettyBytes(data.length) + ')...')
    
        fs.writeFile(filename, data, (error) => {
          if (error) {
            console.error(error)
    
            process.exit(1)
          }
    
          writeCount++
    
          if (writeCount === totalFiles) {
            console.log('\nDone! ✅')
          }
        })
      }
    })
  }
}