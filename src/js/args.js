// Exports:
module.exports = function args(args) {
  const arguments = {
    encoding: 'utf8',
    input: '.',
    output: '.'
  }

  for (let arg of args) {
    let substring = arg.substring(0, 9)

    if (arg.substring(0, 8) === '--input=') {
      arguments.input = arg.slice(8)
    } else if (arg.substring(0, 11) === '--encoding=') {
      arguments.encoding = arg.slice(11)
    } else if (substring === '--output=') {
      arguments.output = arg.slice(9)
    } else if (substring === '--header=') {
      arguments.header = arg.slice(9)
    } else if (substring === '--footer=') {
      arguments.footer = arg.slice(9)
    }
  }

  return arguments
}