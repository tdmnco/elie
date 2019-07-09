// Requires:
const replaceRegex = require('./replace-regex')
const slugify = require('slugify')

// Exports:
module.exports = function replaceFile(file, data) {
  const args = data.args
  const meta = file.meta
  const folder = file.directory.replace(args.input, '').slice(1) + '/' + (slugify(meta.filename || meta.title).toLowerCase())
  const footer = data.templates.footer
  const header = data.templates.header

  return new Promise((resolve) => {
    let markdown = header + '\n' + file.markdown + '\n' + footer
      
    for (let forEach of file.forEaches) {
      if (forEach.sortBy !== 'none') {
        forEach.replaced.sort((a, b) => {
          return a.meta[forEach.sortBy] < b.meta[forEach.sortBy] ? (forEach.sortOrder === 'asc' ? -1 : 1) : (forEach.sortOrder === 'asc' ? 1 : -1)
        })
      }

      let content = ''

      for (let replaced of forEach.replaced) {
        content = content + replaced.content
      }

      markdown = markdown.replace('<for-each-placeholder:' + forEach.count + '>', content)
    }

    for (let key in meta) {
      markdown = replaceRegex(markdown, '{{ ' + key + ' }}', meta[key])
    }

    if (markdown.indexOf('{{ link to folder }}') !== -1) {
      markdown = replaceRegex(markdown, '{{ link to folder }}', folder)
    }

    if (markdown.indexOf('{{ link to html }}') !== -1) {
      markdown = replaceRegex(markdown, '{{ link to folder }}', folder + '.html')
    }

    resolve(markdown)
  })
}