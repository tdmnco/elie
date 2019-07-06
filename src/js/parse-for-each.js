// Exports:
module.exports = function parseForEach(markdown, path) {
  const forEaches = []

  let forEachCount = 0
  let iterateForEach = true

  while (iterateForEach) {
    const forEachStart = markdown.indexOf('{{ for each ')
    const end = markdown.indexOf('{{ end }}')

    if (forEachStart != -1 && end === -1) {
      console.error('{{ for each }} missing an {{ end }} in ' + path + ', aborting!')
      
      process.exit(1)
    }

    if (forEachStart === -1) {
      iterateForEach = false
    } else {
      const forEachEnd = markdown.indexOf('}}') + 2
      const endStart = markdown.indexOf('{{ end }}')
      const endEnd = endStart + 9

      if (endStart < forEachEnd) {
        console.error('{{ end }} before {{ for each }} in ' + path + ', aborting!')
      
        process.exit(1)
      }

      const forEach = markdown.slice(forEachStart, endEnd)
      
      let directory = markdown.slice(forEachStart, forEachEnd).replace('{{ for each ', '').replace(' }}', '').trim()
      let limit = 0
      let offset = 0
      let sortBy = 'none'
      let sortOrder = 'asc'
      
      if (directory.indexOf(' ') != -1) {
        const split = directory.split(' ')

        directory = split[0]

        for (let keyValue of split) {
          keyValue = keyValue.split('=')

          if (keyValue[0] === 'limit') {
            limit = keyValue[1]
          } else if (keyValue[0] === 'offset') {
            offset = keyValue[1]
          } else if (keyValue[0] === 'sortBy') {
            sortBy = keyValue[1]
          } else if (keyValue[0] === 'sortOrder') {
            sortOrder = keyValue[1]
          }
        }
      } else if (directory === '}}') {
        console.error('{{ for each }} used without directory name in ' + path + ', aborting!')
      
        process.exit(1)
      }

      forEaches.push({ directory, forEach, forEachCount, limit, offset, sortBy, sortOrder })

      markdown = markdown.replace(forEach, '<for-each-placeholder:' + forEachCount + '>')
    }

    forEachCount++
  }

  return { forEaches, markdown }
}