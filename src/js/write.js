// Requires:
const fs = require('fs')
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
    totalFiles += file.markdown.length
  }

  for (let file of files) {
    mkdirp(path.join(file.output.directory), (error) => {
      if (error) {
        console.error(error)

        process.exit(1)
      }

      for (let markdown of file.markdown) {
        let filename = file.output.location

        if (markdown.paginated) {
          filename = filename + (markdown.page === 0 ? '' : '-' + markdown.page)
        }

        filename = path.join(filename + '.html')
        
        let data = markdown.html
                
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