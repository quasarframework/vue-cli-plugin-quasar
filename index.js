module.exports = (api, options) => {
  if (options.pluginOptions.quasar.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    const
      theme = options.pluginOptions.quasar.theme,
      importAll = options.pluginOptions.quasar.importAll

    if (!importAll) {
      chain.resolve.extensions
        .prepend(`.${theme}.js`)

      chain.plugin('define')
        .tap(args => {
          const { 'process.env': env, ...rest } = args[0]
          return [{
            'process.env': Object.assign(
              {},
              env,
              { THEME: JSON.stringify(theme) }
            ),
            ...rest
          }]
        })
    }

    chain.resolve.alias
      .set(
        'quasar',
        importAll
          ? api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.esm.js`)
          : 'quasar-framework'
      )
      .set('variables', api.resolve(`src/styles/quasar.variables.styl`))
      .set('quasar-variables', api.resolve(`node_modules/quasar-framework/src/css/core.variables.styl`))
      .set('quasar-styl', api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.styl`))
      .set('quasar-addon-styl', api.resolve(`node_modules/quasar-framework/src/css/flex-addon.styl`))

    chain.performance
      .maxEntrypointSize(512000)
  })
}
