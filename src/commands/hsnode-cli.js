module.exports = {
  name: 'hsnode-cli',
  run: async toolbox => {
    const { print } = toolbox

    print.info('Welcome to your CLI')
  }
}
