// Requires:
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replaceOperators(markdown, values) {
  if (markdown.indexOf('{{ content }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ content }}', values.content)
  }

  if (markdown.indexOf('{{ next page number }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ next page number }}', values.nextPage)
  }

  if (markdown.indexOf('{{ previous page number }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ previous page number }}', values.previousPage)
  }

  if (markdown.indexOf('{{ previous page number unless zero }}') !== -1) {
    const previousPage = values.previousPage

    markdown = replaceRegex(markdown, '{{ previous page number unless zero }}', previousPage === 0 ? '' : previousPage)
  }

  if (markdown.indexOf('{{ slug }}') !== -1) {
    markdown = replaceRegex(markdown, '{{ slug }}', values.slug)
  }

  return markdown
}