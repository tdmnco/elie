// Requires:
const fs = require('fs')
const path = require('path')

// Exports:
module.exports = function readTemplates(args) {
  const templates = { header: '', footer: '' }
  
  let templatesRead = 0
  let totalTemplates = 0

  return new Promise((resolve) => {    
    const templatesToRead = []

    for (let template in templates) {
      const location = args[template]

      if (location) {
        templatesToRead.push({ input: { location }, template })
      }
    }

    if (templatesToRead.length === 0) {
      resolve(templates)
    } else {
      totalTemplates = Object.keys(templatesToRead).length

      for (let templateToRead of templatesToRead) {
        fs.readFile(path.join(templateToRead.input.location), args.encoding, (error, data) => {
          if (error) {
            console.error(error)
    
            process.exit(1)
          }
  
          templates[templateToRead.template] = data
  
          templatesRead++
  
          if (templatesRead === totalTemplates) {
            resolve(templates)
          }
        })
      }  
    }
  })
}