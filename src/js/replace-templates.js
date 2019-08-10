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

      file.markdown = replaceRegex(file.markdown, template.placeholder, data.templates[template.name].content)
    }

    resolve()
  })
}