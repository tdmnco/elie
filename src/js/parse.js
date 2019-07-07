// Requires:
const grayMatter = require('gray-matter')
const parseForEach = require('./parse-for-each')

// Exports:
module.exports = function parse(data) {
  const totalFiles = data.files.length

  let filesRead = 0
  
  return new Promise((resolve) => {
    for (let file of data.files) {
      const matter = grayMatter(file.content)
      const meta = matter.data
      const parsed = parseForEach(matter.content, file.path)
      
      file.forEaches = parsed.forEaches
      file.markdown = parsed.markdown
      file.meta = meta

      filesRead++
      
      if (filesRead === totalFiles) {
        resolve(data)
      }
    }
  })
}