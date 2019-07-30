// Exports:
module.exports = function replaceNewlines(markdown) {
  const split = markdown.split('\n')
  const trimmed = []

  for (let line of split) {
    trimmed.push(line.trim())
  }

  return trimmed.join('\n')
}