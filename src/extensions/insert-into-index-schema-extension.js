const fs = require('fs')
module.exports = (toolbox) => {
  const {
    print,
    template: { generate },
    filesystem
  } = toolbox

  toolbox.insertIntoIndexSchema = async (file, fileName) => {
    let fileString = fs.readFileSync(file, 'utf8')
    let fileArray = fileString.split('\n')

    fileArray.splice(0,0,`const { types: types${fileName}, mutations: mutations${fileName}, queries: queries${fileName} } = require('./${fileName}')`)

    fileArray.forEach((item, index) => {
      if(item.replace(/[\n\r]/g, "").search(new RegExp(/\${types\w+}$/)) > 0) {
        if(fileArray[index+1] === "") {
          fileArray.splice(index+1, 0, `  \${types${fileName}},`)
          return
        }
      }
    })

    fileArray.forEach((item, index) => {
      if(item.replace(/[\n\r]/g, "").search(new RegExp(/type\sQuery\s{$/)) > 0) {
        fileArray.splice(index+1, 0, "    ${queries"+fileName+"}")
        return
      }
    })

    fileArray.forEach((item, index) => {
      if(item.replace(/[\n\r]/g, "").search(new RegExp(/type\sMutation\s{$/)) > 0) {
        fileArray.splice(index+1, 0, "    ${mutations"+fileName+"}")
        return
      }
    })

    filesystem.remove(file)

    fileString = fileArray.join('\n')

    filesystem.write(file, fileString)
  }
}