const fs = require('fs')
module.exports = (toolbox) => {
  const {
    print,
    template: { generate },
    filesystem,
  } = toolbox

  async function insertIntoIndexResolver(file,fileName){
    let fileString = fs.readFileSync(file, 'utf8')
    let fileArray = fileString.split('\n')

    fileArray.splice(0,0,`const queries: queries${fileName}, mutations: mutations${fileName} = require('./${fileName}')`)

    fileArray.forEach((item, index) => {
      if(item.replace(/[\n\r]/g, "").search(new RegExp(/Query: {$/)) > 0) {
        fileArray.splice(index+1, 0, `      ...queries${fileName}`)
        return
      }
    })

    fileArray.forEach((item, index) => {
      if(item.replace(/[\n\r]/g, "").search(new RegExp(/Mutation: {$/)) > 0) {
        fileArray.splice(index+1, 0, `      ...mutations${fileName}`)
        return
      }
    })
  }



}