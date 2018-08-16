module.exports = (api, options) => {
  const
    theme = options.pluginOptions.quasar.theme,
    rtl = options.pluginOptions.quasar.rtlSupport,
    all = options.pluginOptions.quasar.framework === 'all'

  if (rtl) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    chain.module.rule('babel')
      .test(/\.jsx?$/)
      .exclude
        .add(filepath => {
          // always transpile js(x) in Vue files
          if (/\.vue\.jsx?$/.test(filepath)) {
            return false
          }

          if ([/[\\/]node_modules[\\/]quasar-framework[\\/]/].some(dep => filepath.match(dep))) {
            return false
          }

          // don't transpile anything else in node_modules
          return /[\\/]node_modules[\\/]/.test(filepath)
        })
        .end()
      .use('babel-loader')
      .loader('babel-loader')
        .options({
          extends: api.resolve('babel.config.js'),
          plugins: !all ? [
            [
              'transform-imports', {
                quasar: {
                  transform: `quasar-framework/dist/babel-transforms/imports.${theme}.js`,
                  preventFullImport: true
                }
              }
            ]
          ] : []
        })

    chain
      .resolve
        .alias
          .set('quasar', api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.esm.js`))
          .set('variables', api.resolve(`src/styles/quasar.variables.styl`))
          .set('quasar-variables', api.resolve(`node_modules/quasar-framework/src/css/core.variables.styl`))
          .set('quasar-styl', api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.styl`))
          .set('quasar-addon-styl', api.resolve(`node_modules/quasar-framework/src/css/flex-addon.styl`))
  })
}
