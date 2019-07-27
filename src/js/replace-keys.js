// Requires:
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replaceKeys(markdown, meta) {
  for (let key in meta) {
    markdown = replaceRegex(markdown, '{{ ' + key + ' }}', meta[key])
  }

  return markdown
}