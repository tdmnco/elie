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

        const previousPage = page - 1
        const nextPage = page + 1

        if (markdown.indexOf('{{ next page number }}') !== -1) {
          markdown = replaceRegex(markdown, '{{ next page number }}', nextPage)
        }

        if (markdown.indexOf('{{ previous page number }}') !== -1) {
          markdown = replaceRegex(markdown, '{{ previous page number }}', previousPage)
        }

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

        paginate.push({ html: marked(markdown), markdown, page })

        offset = offset + limit
        limit = limit + limit
      }
    }

    resolve(paginate)
  })
}