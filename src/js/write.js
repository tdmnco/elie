// Requires:
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
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

    let data = file.markdown

    data = templates.header + data + templates.footer

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