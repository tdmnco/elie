// Exports:
module.exports = function args(args) {
  const parsed = {
    encoding: 'utf8',
    input: '.',
    output: '.'
  }

  for (let arg of args) {
    let substring = arg.substring(0, 9)

    if (arg.substring(0, 8) === '--input=') {
      parsed.input = arg.slice(8)
    } else if (arg.substring(0, 11) === '--encoding=') {
      parsed.encoding = arg.slice(11)
    } else if (substring === '--output=') {
      parsed.output = arg.slice(9)
    } else if (substring === '--header=') {
      parsed.header = arg.slice(9)
    } else if (substring === '--footer=') {
      parsed.footer = arg.slice(9)
    }
  }

  return parsed
}