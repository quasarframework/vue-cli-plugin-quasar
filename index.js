const path = require('path')

module.exports = (api, options) => {
  if (options.pluginOptions.quasar.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    chain.resolve.alias
      .set(
        'quasar-variables',
        api.resolve('src/styles/quasar.variables.styl')
      )
      .set(
        'quasar-variables-styl',
        'quasar/src/css/variables.styl'
      )
      .set(
        'quasar-styl',
        'quasar/dist/quasar.styl'
      )
      .set(
        'quasar-addon-styl',
        'quasar/src/css/flex-addon.styl'
      )

    chain.performance.maxEntrypointSize(512000)

    const strategy = options.pluginOptions.quasar.importStrategy

    if (['kebab', 'pascal', 'combined'].includes(strategy)) {
      chain.module.rule('vue')
        .use('quasar-auto-import')
        .loader(path.join(__dirname, 'lib/loader.auto-import.js'))
        .options(strategy)
        .before('cache-loader')
    }
    else if (![void 0, 'manual'].includes(strategy)) {
      console.error(`Incorrect setting for quasar > importStrategy (${strategy})`)
      console.error(`Use one of: 'kebab', 'pascal', 'combined', 'manual'.`)
      console.log()
      process.exit(1)
    }
  })
}
