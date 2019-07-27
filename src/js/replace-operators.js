// Requires:
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replaceOperators(markdown, location) {
  if (markdown.indexOf('{{ link to directory }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ link to directory }}', location)
  }

  if (markdown.indexOf('{{ link to html }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ link to html }}', location + '.html')
  }

  return markdown
}