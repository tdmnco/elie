// Requires:
const marked = require('marked')
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replacePaginate(file, data) {
  const meta = file.meta
  const location = file.output.location
  const footer = data.templates.footer
  const header = data.templates.header
  
  return new Promise((resolve) => {
    const paginate = []
    const skeleton = header + '\n' + file.markdown + '\n' + footer

    for (let forEach of file.forEaches) {
      if (forEach.sortBy !== 'none') {
        forEach.replaced.sort((a, b) => {
          return a.meta[forEach.sortBy] < b.meta[forEach.sortBy] ? (forEach.sortOrder === 'asc' ? -1 : 1) : (forEach.sortOrder === 'asc' ? 1 : -1)
        })  
      }

      let limit = forEach.limit
      let pages = forEach.paginate ? Math.ceil(forEach.replaced.length / limit) : 1
      let offset = forEach.offset - 1

      for (let page = 0; page < pages; page++) {
        const pagination = forEach.replaced.slice(offset, limit)

        let content = ''

        for (let replaced of pagination) {
          content = content + replaced.content
        }

        let markdown = skeleton.replace(forEach.placeholder, content)

        for (let key in meta) {
          markdown = replaceRegex(markdown, '{{ ' + key + ' }}', meta[key])
        }
    
        if (markdown.indexOf('{{ link to directory }}') !== -1) {
          markdown = replaceRegex(markdown, '{{ link to directory }}', location)
        }
    
        if (markdown.indexOf('{{ link to html }}') !== -1) {
          markdown = replaceRegex(markdown, '{{ link to html }}', location + '.html')
        }

        paginate.push({ html: marked(markdown), markdown, page })

        offset = offset + limit
        limit = limit + limit
      }
    }

    resolve(paginate)
  })
}