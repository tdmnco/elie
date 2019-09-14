// Requires:
const chalk = require('chalk')
const marked = require('marked')
const prettier = require('prettier')
const replaceKeys = require('./replace-keys')
const replaceOperators = require('./replace-operators')
const replaceRegex = require('./replace-regex')

// Constants:
const prettierOptions = { parser: 'html' }

// Exports:
module.exports = function replacePaginate(file) {
  const meta = file.meta
  const location = file.input.location
  const paginated = []
  const original = file.markdown
  
  return new Promise((resolve) => {
    if (file.forEaches.length === 0) {
      let markdown = original

      markdown = replaceKeys(markdown, meta)
      markdown = replaceOperators(markdown, { slug: file.output.slug })

      paginated.push({ html: prettier.format(marked(markdown), prettierOptions), markdown, paginated: false })
    } else {
      for (let forEach of file.forEaches) {
        if (forEach.sortBy !== 'none') {
          forEach.replaced.sort((a, b) => {
            let first = a.meta[forEach.sortBy]
            let second = b.meta[forEach.sortBy]

            if (first instanceof Date && second instanceof Date) {
              first = first.getTime()
              second = second.getTime()
            }

            return first < second ? (forEach.sortOrder === 'asc' ? -1 : 1) : (forEach.sortOrder === 'asc' ? 1 : -1)
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
  
          let markdown = original.replace(forEach.placeholder, content)
          
          const previousPage = page - 1
          const nextPage = page + 1

          markdown = replaceOperators(markdown, { nextPage, previousPage, slug: forEach.slug })
          markdown = replaceKeys(markdown, meta)
  
          const endIfNextPageStart = markdown.indexOf('{{ end if next page }}')
          const ifNextPageStart = markdown.indexOf('{{ if next page }}')
          
          if (ifNextPageStart && !endIfNextPageStart) {
            console.error(chalk.red('ERROR: ') + '{{ if next page }} used without {{ end if next page }} in ' + location + ', aborting!')
              
            process.exit(1)
          }
  
          if (!ifNextPageStart && endIfNextPageStart) {
            console.error(chalk.red('ERROR: ') + '{{ end if next page }} used without {{ if next page }} in ' + location + ', aborting!')
              
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
            console.error(chalk.red('ERROR: ') + '{{ if previous page }} used without {{ end if previous page }} in ' + location + ', aborting!')
              
            process.exit(1)
          }
  
          if (!ifPreviousPageStart && endIfPreviousPageStart) {
            console.error(chalk.red('ERROR: ') + '{{ end if previous page }} used without {{ if previous page }} in ' + location + ', aborting!')
              
            process.exit(1)
          }
  
          if (ifPreviousPageStart !== -1 && previousPage === -1) {
            const before = markdown.slice(0, ifPreviousPageStart)
            const after = markdown.slice(endIfPreviousPageStart + 26)
            
            markdown = before + after
          }
  
          markdown = replaceRegex(markdown, '{{ if previous page }}', '')
          markdown = replaceRegex(markdown, '{{ end if previous page }}', '')

          paginated.push({ html: prettier.format(marked(markdown), prettierOptions), markdown, page, paginated: true })
  
          offset = offset + limit
        }
      }
    }

    resolve(paginated)
  })
}