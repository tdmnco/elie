// Exports:
module.exports = function parsePaginate(markdown, forEaches, location) {
  const match = markdown.match(/{{ paginate/gi)

  if (match && match.length > 1) {
    console.error('Multiple uses of {{ paginate }} is not supported in ' + location + ', aborting!')
    
    process.exit(1)
  }

  const paginateStart = markdown.indexOf('{{ paginate ')
  const paginateEnd = markdown.indexOf('}}', paginateStart) + 2
  const paginate = markdown.slice(paginateStart, paginateEnd)

  if (paginateStart === -1) {
    return { forEaches, markdown }
  }

  const endStart = markdown.indexOf('{{ end }}', paginateEnd)
  const endEnd = endStart + 9
  const end = markdown.slice(endStart, endEnd)

  if (paginateStart != -1 && endStart === -1) {
    console.error('{{ paginate }} missing an {{ end }} in ' + location + ', aborting!')
    
    process.exit(1)
  }

  if (endStart < paginateEnd) {
    console.error('{{ end }} before {{ paginate }} in ' + location + ', aborting!')
  
    process.exit(1)
  }

  if (!/<for-each-placeholder:/.test(markdown.slice(paginateEnd, endStart))) {
    console.error('{{ paginate }} used without {{ for each }} in ' + location + ', aborting!')
  
    process.exit(1)
  }

  for (let forEach of forEaches) {
    if (markdown.indexOf(forEach.placeholder) > -1) {
      forEach.paginate = true
    }
  }

  markdown = markdown.replace(paginate, '')
  markdown = markdown.replace(end, '')

  return { forEaches, markdown }
}