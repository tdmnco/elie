// Requires:
const path = require('path')
const slugify = require('slugify')

// Exports:
module.exports = function parseOutput(file, meta, data) {
  const args = data.args
  const title = meta.title

  let filename = meta.filename

  if (!filename && !title) {
    console.error('No filename or title contained in the metadata for ' + file.input.location + ', aborting!')

    process.exit(1)
  }

  let input = args.input
  let slug = slugify((filename || title) + '').toLowerCase()

  if (input.slice(-3) === '.md') {
    const split = input.split('/')

    split.pop()

    input = split.join('/')
  }

  let directory = file.input.directory.replace(input, '')

  if (directory.slice(0, 1) === '/') {
    directory = directory.slice(1)
  }

  directory = args.output + '/' + directory

  return { directory, location: path.join(directory + '/' + slug), slug }
}