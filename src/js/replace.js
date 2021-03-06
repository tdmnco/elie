// Requires:
const replaceForEach = require('./replace-for-each')
const replacePaginate = require('./replace-paginate')
const replaceTemplates = require('./replace-templates')

// Exports:
module.exports = function replace(data) {
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      replaceTemplates(file, data).then(() => {
        replaceForEach(file, data).then(() => {
          replacePaginate(file, data).then((paginated) => {
            file.markdown = paginated
  
            filesRead++
            
            if (filesRead === totalFiles) {
              resolve(data)
            }
          })
        })
      })
    }
  })
}
