// Exports:
module.exports = function parseTemplates(markdown, meta, data, location) {
  if (meta.template) {
    const template = data.templates[meta.template]

    if (!template) {
      console.error('template: ' + meta.template + ' given in ' + location + ' but the template file does not exist, but aborting!')
    
      process.exit(1)
    }

    markdown = template.content.replace('{{ content }}', markdown)
  }

  const templates = []

  let count = 0
  let loop = true

  while (loop) {
    const start = markdown.indexOf('{{ template ')
    const endStart = markdown.indexOf(' }}', start)
    const endEnd = endStart + 3

    if (start === -1) {
      loop = false
    } else {
      const name = markdown.slice(start, endEnd).replace('{{ template ', '').replace(' }}', '').trim()
      const placeholder = '<template-placeholder:' + count + '>'
      const template = markdown.slice(start, endEnd)

      templates.push({ name, placeholder })

      markdown = markdown.replace(template, placeholder)
    }

    count++
  }

  return { templates, markdown }
}