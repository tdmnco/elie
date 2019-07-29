// Requires:
const fs = require('fs')
const glob = require('glob')
const grayMatter = require('gray-matter')
const path = require('path')
const replaceKeys = require('./replace-keys')
const replaceOperators = require('./replace-operators')
const replaceRegex = require('./replace-regex')
const slugify = require('slugify')

// Exports:
module.exports = function replaceForEach(file, data) {
  const promises = []

  return new Promise((resolve) => {
    for (let forEach of file.forEaches) {
      let markdown = forEach.markdown

      markdown = markdown.substring(markdown.indexOf('}}') + 2)
      markdown = markdown.replace('{{ end for each }}', '')

      promises.push(new Promise((innerResolve) => {
        glob(file.input.directory + '/' + forEach.directory + '/*.md', function(error, files) {
          if (error) {
            console.error(error)
      
            process.exit(1)
          }

          const totalFiles = files.length
  
          let readCount = 0
      
          for (let index in files) {
            let location = files[index]
  
            fs.readFile(path.join(location), data.args.encoding, (error, content) => {
              if (error) {
                console.error(error)

                process.exit(1)
              }
  
              const matter = grayMatter(content)
              const meta = matter.data
              const filename = meta.filename
              const title = meta.title

              if (!filename && !title) {
                console.error('No filename or title contained in the metadata for ' + file.input.location + ', aborting!')
            
                process.exit(1)
              }

              const slug = slugify(filename || title).toLowerCase()

              let replaced = '' + markdown
  
              replaced = replaceKeys(replaced, meta)
              replaced = replaceOperators(replaced, { content: matter.content, slug })

              if (!forEach.replaced) {
                forEach.replaced = []
              }

              forEach.replaced.push({ content: replaced, meta, slug })

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