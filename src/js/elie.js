// Requires:
const args = require('./args')
const read = require('./read')
const write = require('./write')

// Functions:
function elie() {
  console.log('📝 Elie reporting in!\n')

  const arguments = args(process.argv)

  read(arguments).then((files) => {
    write(files, arguments)
  })
}

// Exports:
module.exports = elie