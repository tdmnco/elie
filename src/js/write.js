// Requires:
const fs = require('fs')
const minify = require('html-minifier').minify;
const prettyBytes = require('pretty-bytes')
const slugify = require('slugify')

// Exports:
module.exports = function write(files, args) {
  const totalFiles = Object.keys(files).length

  let writeCount = 0

  for (let file of files) {
    const title = file.meta.title

    let filename = file.meta.filename

    if (!filename && !title) {
      console.error('No filename or title contained in the metadata for ' + file.path + ', aborting!')

      process.exit(1)
    }
    
    filename = args.output + '/' + (slugify(file.meta.filename || file.meta.title).toLowerCase()) + '.html'

    const data = minify(file.html, {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeTagWhitespace: true
    })

    console.log('Writing ' + filename + ' (' + prettyBytes(file.html.length) + ')...')

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
}