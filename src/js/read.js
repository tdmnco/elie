// Requires:
const readFiles = require('./read-files')
const readTemplates = require('./read-templates')

// Exports:
module.exports = function read(args) {
  return new Promise((resolve) => {
    readFiles(args).then((files) => {
      readTemplates(args).then((templates) => {
        resolve({ files, templates })
      })
    })
  })
}