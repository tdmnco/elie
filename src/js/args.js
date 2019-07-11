// Exports:
module.exports = function args(args) {
  const parsed = {
    encoding: 'utf8',
    input: '.',
    minify: false,
    output: '.'
  }

  for (let arg of args) {
    arg = arg.replace('--', '')

    const split = arg.split('=')
    const key = split[0]
    
    let value = split[1]

    if ((key === 'input' || key === 'output') && value.slice(-1) === '/') {
      value = value.slice(0, value.length - 1)
    } else if (key === 'minify') {
      value = value === 'true'
    }

    parsed[key] = value
  }

  return parsed
}