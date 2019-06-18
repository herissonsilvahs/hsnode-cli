const fs = require('fs')
module.exports = (toolbox) => {
  const {
    print,
    template: { generate },
    filesystem
  } = toolbox

  async function createResolver(name, path = './') {
    const fileName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    await generate({
      template: 'resolver.js.ejs',
      target: `${path}resolvers/${fileName}.js`,
      props: { fileName }
    })
  }

  async function createSchema(name, path) {
    const fileName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    await generate({
      template: 'schema.js.ejs',
      target: `${path}schemas/${fileName}.js`
    })
  }

  async function expressApi (type, name, routeMethod) {
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
      createResolver(name)
    } else if (type === 'schema') {
      createSchema(name)
    } else {
      print.error(`Argument ${type} not found for this project`)
    }
  }

  async function createFile(type, name, routeMethod) {
    const package = filesystem.read('package.json', 'json')
    if (package.dependencies.express) {
      expressApi(type, name, routeMethod)
    } else if (package.dependencies['express-graphql']) {
      graphqlApi(type, name)
    } else {
      print.error('Project not supported for this command')
    }
  }
}