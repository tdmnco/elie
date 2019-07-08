// Requires:
const marked = require('marked')
const replaceFile = require('./replace-file')
const replaceForEach = require('./replace-for-each')

// Exports:
module.exports = function replace(data) {
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      replaceForEach(file, data).then(() => {
        replaceFile(file, data).then((markdown) => {
          file.markdown = markdown
          file.html = marked(markdown)
      
          filesRead++
          
          if (filesRead === totalFiles) {
            resolve(data)
          }
        })
      })
    }
  })
}
