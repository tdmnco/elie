// Requires:
const marked = require('marked')
const replaceKeys = require('./replace-keys')
const replaceNewlines = require('./replace-newlines')
const replaceOperators = require('./replace-operators')
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replacePaginate(file, data) {
  const meta = file.meta
  const location = file.output.location
  const footer = replaceNewlines(data.templates.footer)
  const header = replaceNewlines(data.templates.header)
  
  return new Promise((resolve) => {
    const paginated = []
    const skeleton = header + '\n' + file.markdown + '\n' + footer

    if (file.forEaches.length === 0) {
      let markdown = skeleton

      markdown = replaceKeys(markdown, meta)
      markdown = replaceOperators(markdown, location)

      paginated.push({ html: marked(markdown), markdown, paginated: false })
    } else {
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
          const pagination = forEach.replaced.slice(offset, offset + limit)
  
          let content = ''
  
          for (let replaced of pagination) {
            content = content + replaced.content
          }
  
          let markdown = skeleton.replace(forEach.placeholder, content)
  
          const previousPage = page - 1
          const nextPage = page + 1

          markdown = replaceKeys(markdown, meta)
          markdown = replaceOperators(markdown, { nextPage, previousPage, slug: forEach.slug })
  
          const endIfNextPageStart = markdown.indexOf('{{ end if next page }}')
          const ifNextPageStart = markdown.indexOf('{{ if next page }}')
          
          if (ifNextPageStart && !endIfNextPageStart) {
            console.error('{{ if next page }} used without {{ end if next page }} in ' + file.input.location + ', aborting!')
              
            process.exit(1)
          }
  
          if (!ifNextPageStart && endIfNextPageStart) {
            console.error('{{ end if next page }} used without {{ if next page }} in ' + file.input.location + ', aborting!')
              
            process.exit(1)
          }
  
          if (ifNextPageStart !== -1 && nextPage === pages) {
            const before = markdown.slice(0, ifNextPageStart)
            const after = markdown.slice(endIfNextPageStart + 22)
            
            markdown = before + after
          }
  
          markdown = replaceRegex(markdown, '{{ if next page }}', '')
          markdown = replaceRegex(markdown, '{{ end if next page }}', '')
  
          const endIfPreviousPageStart = markdown.indexOf('{{ end if previous page }}')
          const ifPreviousPageStart = markdown.indexOf('{{ if previous page }}')
          
          if (ifPreviousPageStart && !endIfPreviousPageStart) {
            console.error('{{ if previous page }} used without {{ end if previous page }} in ' + file.input.location + ', aborting!')
              
            process.exit(1)
          }
  
          if (!ifPreviousPageStart && endIfPreviousPageStart) {
            console.error('{{ end if previous page }} used without {{ if previous page }} in ' + file.input.location + ', aborting!')
              
            process.exit(1)
          }
  
          if (ifPreviousPageStart !== -1 && previousPage === -1) {
            const before = markdown.slice(0, ifPreviousPageStart)
            const after = markdown.slice(endIfPreviousPageStart + 26)
            
            markdown = before + after
          }
  
          markdown = replaceRegex(markdown, '{{ if previous page }}', '')
          markdown = replaceRegex(markdown, '{{ end if previous page }}', '')
  
          paginated.push({ html: marked(markdown), markdown, page, paginated: true })
  
          offset = offset + limit
        }
      }
    }

    resolve(paginated)
  })
}