// Requires:
const replaceForEach = require('./replace-for-each')
const replacePaginate = require('./replace-paginate')

// Exports:
module.exports = function replace(data) {
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      replaceForEach(file, data).then(() => {
        replacePaginate(file, data).then((paginate) => {
          file.paginate = paginate
      
          filesRead++
          
          if (filesRead === totalFiles) {
            resolve(data)
          }
        })
      })
    }
  })
}
