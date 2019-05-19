// Requires:
const readFiles = require('./read-files')
const readTemplates = require('./read-templates')

// Exports:
module.exports = function read(args) {
  console.log('Opening path ' + args.input + '/*.md\n')

  return new Promise((resolve) => {
    readFiles(args).then((files) => {
      readTemplates(args).then((templates) => {
        resolve({ files, templates })
      })
    })
  })
}