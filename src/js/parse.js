// Requires:
const grayMatter = require('gray-matter')
const marked = require('marked')
const parseForEach = require('./parse-for-each')
const replace = require('./replace')

// Exports:
module.exports = function parse(data, args) {
  const footer = data.templates.footer
  const header = data.templates.header
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      const matter = grayMatter(file.content)
      const meta = matter.data
      const parsedForEach = parseForEach(matter.content, file.path)
      
      file.meta = meta

      replace(parsedForEach, file, args, header, footer).then((markdown) => {
        file.markdown = markdown
        file.html = marked(markdown)

        filesRead++
        
        if (filesRead === totalFiles) {
          resolve(data)
        }
      })
    }
  })
}