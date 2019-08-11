// Requires:
const replaceRegex = require('./replace-regex')

// Exports:
module.exports = function replaceTemplates(file, data) {
  return new Promise((resolve) => {
    for (let template of file.templates) {
      if (!data.templates[template.name]) {
        console.error('{{ template ' + template.name + ' }} used but the template file does not exist in ' + data.args.templates + ', aborting!')
          
        process.exit(1)
      }

      const content = data.templates[template.name].content
      const placeholder = template.placeholder

      file.markdown = replaceRegex(file.markdown, placeholder, content)

      for (let forEach of file.forEaches) {
        forEach.markdown = replaceRegex(forEach.markdown, placeholder, content)
      }
    }

    resolve()
  })
}