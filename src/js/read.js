// Requires:
const readFiles = require('./read-files')
const readTemplates = require('./read-templates')

// Exports:
module.exports = function read(data) {
  const args = data.args

  return new Promise((resolve) => {
    readFiles(args).then((files) => {
      data.files = files

      readTemplates(args).then((templates) => {
        data.templates = templates

        resolve(data)
      })
    })
  })
}