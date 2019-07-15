const fs = require('fs')
module.exports = (toolbox) => {
  const {
    print,
    template: { generate },
    filesystem,
    strings
  } = toolbox

  async function createResolver(name, path = './') {
    const fileName = strings.startCase(name)
    await toolbox.insertIntoIndexResolver(`${path}resolvers/index.js`, fileName)
    await generate({
      template: 'resolver.js.ejs',
      target: `${path}resolvers/${fileName}.js`,
      props: { fileName }
    })
    print.success(`Generated resolver file at ${path}resolvers/${fileName}.js`)
    print.success("Updated file src/resolver/index.js")
  }

  async function createSchema(name, path) {
    const fileName = strings.startCase(name)
    await toolbox.insertIntoIndexSchema(`${path}schema/index.js`, fileName)
    await generate({
      template: 'schema.js.ejs',
      target: `${path}schema/${fileName}.js`
    })
    print.success(`Generated schema file at ${path}schema/${fileName}.js`)
    print.success("Updated file src/schema/index.js")
  }

  async function expressApi (type, name, routeMethod) {
    const startCaseName = strings.startCase(name)
    if (type === 'model') {
      await generate({
        template: 'model.js.ejs',
        target: `models/${startCaseName}.js`,
        props: { name }
      })
      print.info(`Generated model file at models/${startCaseName}.js`)
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
    } else if (type === 'resolver') {
      createResolver(name, 'graphql/')
    } else if (type === 'schema') {
      createSchema(name, 'graphql/')
    } else {
      print.error(`Argument ${type} not found for this project`)
    }
  }

  async function graphqlApi (type, name) {
    if (type === 'resolver') {
      await createResolver(name, './src/')
    } else if (type === 'schema') {
      await createSchema(name, './src/')
    } else {
      print.error(`Argument ${type} not found for this project`)
    }
  }

  toolbox.createFiles = async (type, name, routeMethod) => {
    const package = filesystem.read('package.json', 'json')
    if (package.dependencies['express-graphql']) {
      await graphqlApi(type, name)
    } else if (package.dependencies.express) {
      await expressApi(type, name, routeMethod)
    } else {
      print.error('Project not supported for this command')
    }
  }
}