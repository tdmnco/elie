// Exports:
module.exports = function parsePaginate(markdown, forEaches, location) {
  if (markdown.match(/{{ paginate/gi).length > 1) {
    console.error('Multiple uses of {{ paginate }} is not supported in ' + location + ', aborting!')
    
    process.exit(1)
  }

  const paginateStart = markdown.indexOf('{{ paginate ')

  if (paginateStart === -1) {
    return { forEaches, markdown }
  }

  const end = markdown.indexOf('{{ end }}', paginateStart)

  if (paginateStart != -1 && end === -1) {
    console.error('{{ paginate }} missing an {{ end }} in ' + location + ', aborting!')
    
    process.exit(1)
  }

  const paginateEnd = markdown.indexOf('}}', paginateStart) + 2
  const endStart = markdown.indexOf('{{ end }}', paginateEnd)
  const endEnd = endStart + 9

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

  return { forEaches, markdown }
}