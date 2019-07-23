// Requires:
const grayMatter = require('gray-matter')
const parseForEach = require('./parse-for-each')
const parsePaginate = require('./parse-paginate')

// Exports:
module.exports = function parse(data) {
  const totalFiles = data.files.length

  let filesRead = 0
  
  return new Promise((resolve) => {
    for (let file of data.files) {
      const location = file.location
      const matter = grayMatter(file.content)
      const meta = matter.data
      const parsedForEach = parseForEach(matter.content, location)
      const parsedPaginate = parsePaginate(parsedForEach.markdown, parsedForEach.forEaches, location)
      
      file.forEaches = parsedPaginate.forEaches
      file.markdown = parsedPaginate.markdown
      file.meta = meta

      filesRead++
      
      if (filesRead === totalFiles) {
        resolve(data)
      }
    }
  })
}