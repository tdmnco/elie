// Requires:
const fs = require('fs')
const glob = require('glob')
const grayMatter = require('gray-matter')

// Exports:
module.exports = function replace(parsedForEach, file, args, header, footer) {
  const promises = []

  return new Promise((resolve) => {
    for (let forEach of parsedForEach.forEaches) {
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
  
            fs.readFile(path, args.encoding, (error, content) => {
              if (error) {
                console.error(error)
      
                process.exit(1)
              }
  
              const matter = grayMatter(content)
              const meta = matter.data
  
              for (let key in meta) {
                matter.content = matter.content.replace('{{ ' + key + ' }}', meta[key])
              }
  
              if (!forEach.parsed) {
                forEach.parsed = []
              }

              forEach.parsed.push({ content: matter.content, meta })

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
      let markdown = header + parsedForEach.markdown + footer
      
      for (let forEach of parsedForEach.forEaches) {
        if (forEach.sortBy !== 'none') {
          forEach.parsed.sort((a, b) => {
            return a.meta[forEach.sort] < b.meta[forEach.sort] ? (forEach.sortOrder === 'asc' ? -1 : 1) : (forEach.sortOrder === 'asc' ? 1 : -1)
          })
        }

        let replaced = ''

        for (let parsed of forEach.parsed) {
          replaced = replaced + parsed.content
        }

        markdown = markdown.replace('<for-each-placeholder:' + forEach.forEachCount + '>', replaced)
      }

      const meta = file.meta

      for (let key in meta) {
        let regex = new RegExp('{{ ' + key + ' }}', 'g')

        markdown = markdown.replace(regex, meta[key])
      }

      resolve(markdown)
    })
  })
}
