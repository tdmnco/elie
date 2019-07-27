// Exports:
module.exports = function parseForEach(markdown, location) {
  const forEaches = []

  let count = 0
  let iterateForEach = true

  while (iterateForEach) {
    const forEachStart = markdown.indexOf('{{ for each ')
    const end = markdown.indexOf('{{ end for each }}', forEachStart)

    if (forEachStart != -1 && end === -1) {
      console.error('{{ for each }} missing an {{ end for each }} in ' + location + ', aborting!')
      
      process.exit(1)
    }

    if (forEachStart === -1) {
      iterateForEach = false
    } else {
      const forEachEnd = markdown.indexOf('}}', forEachStart) + 2
      const endStart = markdown.indexOf('{{ end for each }}', forEachEnd)
      const endEnd = endStart + 18

      if (endStart < forEachEnd) {
        console.error('{{ end for each }} before {{ for each }} in ' + location + ', aborting!')
      
        process.exit(1)
      }

      const forEach = markdown.slice(forEachStart, endEnd)
      
      let directory = markdown.slice(forEachStart, forEachEnd).replace('{{ for each ', '').replace(' }}', '').trim()
      let limit = null
      let offset = null
      let sortBy = 'none'
      let sortOrder = 'asc'
      
      if (directory.indexOf(' ') != -1) {
        const split = directory.split(' ')

        directory = split[0]

        if (directory.slice(-1) === '/') {
          directory = directory.slice(0, directory.length - 1)
        }

        for (let keyValue of split) {
          keyValue = keyValue.split('=')

          if (keyValue[0] === 'limit') {
            limit = parseInt(keyValue[1], 10)
          } else if (keyValue[0] === 'offset') {
            offset = parseInt(keyValue[1], 10)
          } else if (keyValue[0] === 'sort-by') {
            sortBy = keyValue[1]
          } else if (keyValue[0] === 'sort-order') {
            sortOrder = keyValue[1]
          }
        }
      } else if (directory === '}}') {
        console.error('{{ for each }} used without directory name in ' + location + ', aborting!')
      
        process.exit(1)
      }

      if (limit !== null && limit < 1) {
        console.error('{{ for each }} contains offset lower than 1 in ' + location + ', aborting!')
      
        process.exit(1)
      }

      if (offset !== null && offset < 1) {
        console.error('{{ for each }} contains offset lower than 1 in ' + location + ', aborting!')
      
        process.exit(1)
      }

      const placeholder = '<for-each-placeholder:' + count + '>'

      forEaches.push({ directory, limit, markdown: forEach, offset, placeholder, sortBy, sortOrder })

      markdown = markdown.replace(forEach, placeholder)
    }

    count++
  }

  return { forEaches, markdown }
}