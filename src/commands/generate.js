
const restApi = async (generate, print, type, name, routeMethod) => {
  if (type === 'model') {
    await generate({
      template: 'model.js.ejs',
      target: `models/${name.charAt(0).toUpperCase()}${name.slice(1)}.js`,
      props: { name }
    })
    print.info(`Generated model file at models/${name.charAt(0).toUpperCase()}${name.slice(1)}.js`)
  } else if (type === 'router') { 
    await generate({
      template: 'route.js.ejs',
      target: `routes/${name}.js`,
      props: { name, routeMethod }
    })
    print.info(`Generated router file at routes/${name}.js`)
    await generate({
      template: 'controller.js.ejs',
      target: `controllers/${name}Controller.js`,
      props: { name }
    })
    print.info(`Generated controller file at controllers/${name}Controller.js`)
  } else {
    print.error(`Argument ${type} not found for this project`)
  }
}

module.exports = {
  name: 'generate',
  description: 'A generator for ExpressJS Rest Api and GraphQL Api projects',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print,
      filesystem
    } = toolbox
    const type = parameters.first
    const name = parameters.second
    const package = filesystem.read('package.json', 'json')
    // console.log(parameters.argv[5])
    if (!package.dependencies['express-graphql'] && package.dependencies.express) {
      restApi(generate, print, type, name, parameters.argv[5] ? parameters.argv[5].slice(2) : 'post')
    } else {
      print.error('Project not supported for this command')
    }
  }
}
