// Requires:
const args = require('./args')
const parse = require('./parse')
const read = require('./read')
const write = require('./write')

// Functions:
function elie() {
  console.log('📝 Elie is eloquent writing.\n')

  const parsed = args(process.argv)

  read(parsed).then((data) => {
    parse(data, parsed).then((data) => {
      write(data.files, parsed)
    })
  })
}

// Exports:
module.exports = elie