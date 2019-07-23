// Requires:
const fs = require('fs')
const glob = require('glob')
const grayMatter = require('gray-matter')
const path = require('path')
const replaceRegex = require('./replace-regex')
const slugify = require('slugify')

// Exports:
module.exports = function replaceForEach(file, data) {
  const promises = []

  return new Promise((resolve) => {
    for (let forEach of file.forEaches) {
      let markdown = forEach.markdown

      markdown = markdown.substring(markdown.indexOf('}}') + 2)
      markdown = markdown.replace('{{ end }}', '')

      promises.push(new Promise((innerResolve) => {
        glob(file.directory + '/' + forEach.directory + '/*.md', function(error, files) {
          if (error) {
            console.error(error)
      
            process.exit(1)
          }

          const totalFiles = files.length
  
          let readCount = 0
      
          for (let index in files) {
            const location = files[index]
  
            fs.readFile(path.join(location), data.args.encoding, (error, content) => {
              if (error) {
                console.error(error)

                process.exit(1)
              }
  
              const matter = grayMatter(content)
              const meta = matter.data
              const location = forEach.directory + '/' + (slugify(meta.filename || meta.title).toLowerCase())

              let replaced = '' + markdown
  
              for (let key in meta) {
                replaced = replaceRegex(replaced, '{{ ' + key + ' }}', meta[key])
              }

              if (replaced.indexOf('{{ content }}') !== -1) {
                replaced = replaceRegex(replaced, '{{ content }}', matter.content)
              }

              if (replaced.indexOf('{{ link to folder }}') !== -1) {
                replaced = replaceRegex(replaced, '{{ link to folder }}', location)
              }

              if (replaced.indexOf('{{ link to html }}') !== -1) {
                replaced = replaceRegex(replaced, '{{ link to html }}', location + '.html')
              }

              if (!forEach.replaced) {
                forEach.replaced = []
              }

              forEach.replaced.push({ content: replaced, meta })

              readCount++

              if (readCount === totalFiles) {
                innerResolve()
              }
            })
          }
        })
      }))
    }

    Promise.all(promises).then(() => {
      resolve({ file, data })
    })
  })
}