// Exports:
module.exports = function regex(string, pattern, replacement, options) {
  return string.replace(new RegExp(pattern, options || 'g'), replacement)
}