// Requires:
const grayMatter = require('gray-matter')
const marked = require('marked')

// Exports:
module.exports = function parse(data) {
  const parsed = grayMatter(data)

  parsed.bytes = data.length
  parsed.markdown = marked(parsed.content)

  return parsed
}