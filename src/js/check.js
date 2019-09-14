// Exports:
module.exports = function check(data) {
  const files = {}
  const totalFiles = data.files.length

  let filesRead = 0

  return new Promise((resolve) => {
    for (let file of data.files) {
      const location = file.output.location
      const addedFile = files[location]

      if (addedFile) {
        console.error('More than one file exists with the same output filename, aborting!\n')
        console.error('-> ' + file.input.location + ' (filename: ' + file.meta.filename + ')')
        console.error('-> ' + addedFile.input.location + ' (filename: ' + addedFile.meta.filename + ')')
    
        process.exit(1)
      }
  
      files[location] = file
  
      filesRead++
  
      if (filesRead === totalFiles) {
        resolve(data)
      }
    }
  })  
}