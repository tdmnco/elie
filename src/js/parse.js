// Requires:
const grayMatter = require('gray-matter')
const parseForEach = require('./parse-for-each')
const parseOutput = require('./parse-output')
const parsePaginate = require('./parse-paginate')
const parseTemplates = require('./parse-templates')

// Exports:
module.exports = function parse(data) {
  const totalFiles = data.files.length

  let filesRead = 0
  
  return new Promise((resolve) => {
    for (let file of data.files) {
      const location = file.input.location
      const matter = grayMatter(file.content)
      const meta = matter.data
      const parsedOutput = parseOutput(file, meta, data)
      const parsedForEach = parseForEach(matter.content, location)
      const parsedPaginate = parsePaginate(parsedForEach.markdown, parsedForEach.forEaches, location)
      const parsedTemplates = parseTemplates(parsedPaginate.markdown)

      file.forEaches = parsedPaginate.forEaches
      file.markdown = parsedTemplates.markdown
      file.meta = meta
      file.output = parsedOutput
      file.templates = parsedTemplates.templates

      filesRead++

      if (filesRead === totalFiles) {
        resolve(data)
      }
    }
  })
}