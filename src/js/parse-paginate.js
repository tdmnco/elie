// Exports:
module.exports = function parsePaginate(parsedForEach, location) {
  const markdown = parsedForEach.markdown
  const paginateStart = markdown.indexOf('{{ paginate ')

  if (paginateStart === -1) {
    return { pagination, markdown }
  }

  const end = markdown.indexOf('{{ end }}')

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
  
  const pagination = parseInt(markdown.slice(paginateStart, paginateEnd).replace('{{ paginate ', '').replace(' }}', '').trim(), 10)

  //console.log('show per page', perPage)
  //console.log('at this point, markdown is', markdown)

  return { pagination, markdown }
}