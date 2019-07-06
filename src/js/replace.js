// Requires:
const fs = require('fs')
const glob = require('glob')
const grayMatter = require('gray-matter')

// Exports:
module.exports = function replace(parsed, file, args, header, footer) {
  const promises = []

  return new Promise((resolve) => {
    for (let forEach of parsed.forEaches) {
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

              forEach.parsed.push({ content: matter.content, count: readCount })

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
      for (let forEach of parsed.forEaches) {
        forEach.parsed.sort((a, b) => {
          return a.count >= b.count ? -1 : 1
        })
      }

      let markdown = header + parsed.markdown + footer
            
      for (let forEach of parsed.forEaches) {
        let replaced = ''

        for (let parsedContent of forEach.parsed) {
          replaced = replaced + parsedContent.content
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
