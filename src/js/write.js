// Requires:
const fs = require('fs')
const minify = require('html-minifier').minify;
const mkdirp = require('mkdirp')
const path = require('path')
const prettyBytes = require('pretty-bytes')

// Exports:
module.exports = function write(data) {
  const args = data.args
  const files = data.files
  
  let totalFiles = 0
  let writeCount = 0

  for (let file of files) {
    totalFiles += file.paginate.length
  }

  console.log('3132525')

  for (let file of files) {
    console.log('FEJLEN ER HER!', file.output.directory)

    mkdirp(path.join(file.output.directory), (error) => {
      if (error) {
        console.error(error)

        process.exit(1)
      }

      console.log('DRUER')

      for (let paginate of file.paginate) {
        const page = paginate.page === 0 ? '' : '-' + paginate.page

        filename = path.join(file.output.location + page + '.html')

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