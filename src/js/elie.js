// Requires:
const args = require('./args')
const chalk = require('chalk')
const check = require('./check')
const parse = require('./parse')
const read = require('./read')
const replace = require('./replace')
const write = require('./write')

// Functions:
function elie() {
  console.log(chalk.white('✏️  ' + chalk.bold('Elie') + ' is ' + chalk.underline('eloquent writing') + '.\n'))

  const data = { args: args(process.argv) }

  read(data).then((data) => {
    parse(data).then((data) => {
      check(data).then((data) => {
        replace(data).then((data) => {
          write(data)
        })
      })
    })
  })
}

// Exports:
module.exports = elie