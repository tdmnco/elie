// Requires:
const fs = require('fs')
const glob = require('glob')
const grayMatter = require('gray-matter')
const marked = require('marked')
const slugify = require('slugify')

// Functions:
function replaceForEaches(file, data) {
  const footer = data.templates.footer
  const header = data.templates.header
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
            const path = files[index]
  
            fs.readFile(path, data.args.encoding, (error, content) => {
              if (error) {
                console.error(error)
      
                process.exit(1)
              }
  
              const matter = grayMatter(content)
              const meta = matter.data

              forEach.path = forEach.directory + '/' + (slugify(meta.filename || meta.title).toLowerCase())

              let replaced = '' + markdown
  
              for (let key in meta) {
                replaced = replaced.replace('{{ ' + key + ' }}', meta[key])
              }

              if (replaced.indexOf('{{ link to html }}') !== -1) {
                let regex = new RegExp('{{ link to html }}', 'g')

                replaced = replaced.replace(regex, forEach.path + '.html')
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
      let markdown = header + file.markdown + footer
      
      for (let forEach of file.forEaches) {
        if (forEach.sortBy !== 'none') {
          forEach.replaced.sort((a, b) => {
            return a.meta[forEach.sortBy] < b.meta[forEach.sortBy] ? (forEach.sortOrder === 'asc' ? -1 : 1) : (forEach.sortOrder === 'asc' ? 1 : -1)
          })
        }

        let content = ''

        for (let replaced of forEach.replaced) {
          content = content + replaced.content
        }

        markdown = markdown.replace('<for-each-placeholder:' + forEach.count + '>', content)
      }

      const meta = file.meta

      for (let key in meta) {
        let regex = new RegExp('{{ ' + key + ' }}', 'g')

        markdown = markdown.replace(regex, meta[key])
      }

      if (markdown.indexOf('{{ link to html }}') !== -1) {
        let regex = new RegExp('{{ link to html }}', 'g')

        markdown = markdown.replace(regex, file.directory.replace(data.args.input, '').slice(1) + '/' + (slugify(meta.filename || meta.title).toLowerCase()) + '.html')
      }

      resolve(markdown)
    })
  })
}

// Exports:
module.exports = function replace(data) {
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      replaceForEaches(file, data).then((markdown) => {
        file.markdown = markdown
        file.html = marked(markdown)
    
        filesRead++
        
        if (filesRead === totalFiles) {
          resolve(data)
        }
      })
    }
  })
}
