// Requires:
const fs = require('fs')
const minify = require('html-minifier').minify;
const prettyBytes = require('pretty-bytes')
const replace = require('./replace')
const slugify = require('slugify')

// Exports:
module.exports = function write(files, templates, args) {
  const totalFiles = Object.keys(files).length

  let filesWritten = 0

  for (let file of files) {
    if (!file.data.title) {
      console.error('\nNo title contained in the metadata for ' + file.path + ', aborting!')

      process.exit(1)
    }
    
    const filename = args.output + '/' + slugify(file.data.title).toLowerCase() + '.html'

    let data = replace(templates.header + file.markdown + templates.footer, file.data)

    data = minify(data, {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeTagWhitespace: true
    })

    console.log('Writing ' + filename + ' (' + prettyBytes(file.markdown.length) + ')...')

    fs.writeFile(filename, data, (error) => {
      if (error) {
        console.error(error)

        process.exit(1)
      }

      filesWritten++

      if (filesWritten === totalFiles) {
        console.log('\nDone! ✅')
      }
    })
  }
}