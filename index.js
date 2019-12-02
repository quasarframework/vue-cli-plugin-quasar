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
  })
}
