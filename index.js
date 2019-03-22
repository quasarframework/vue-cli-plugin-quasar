module.exports = (api, options) => {
  if (options.pluginOptions.quasar.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    const treeShake = options.pluginOptions.quasar.treeShake

    if (!treeShake) {
      chain.resolve.alias.set(
        'quasar$',
        api.resolve('node_modules/quasar/dist/quasar.esm.js')
      )
    }

    chain.resolve.alias
      .set(
        'quasar-variables',
        api.resolve('src/styles/quasar.variables.styl')
      )
      .set(
        'quasar-variables-styl',
        api.resolve('node_modules/quasar/src/css/variables.styl')
      )
      .set(
        'quasar-styl',
        api.resolve('node_modules/quasar/dist/quasar.styl')
      )
      .set(
        'quasar-addon-styl',
        api.resolve('node_modules/quasar/src/css/flex-addon.styl')
      )

    chain.performance.maxEntrypointSize(treeShake ? 512000 : 1024000)
  })
}
