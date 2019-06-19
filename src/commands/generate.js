

module.exports = {
  name: 'generate',
  description: 'A generator for ExpressJS Rest Api and GraphQL Api projects',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print,
      filesystem,
      createFiles
    } = toolbox
    // console.log(toolbox)
    const type = parameters.first
    const name = parameters.second
    const routeMethod = parameters.argv[5] ? parameters.argv[5].slice(2) : 'post'
    await createFiles(type, name, routeMethod)
  }
}
