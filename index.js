module.exports = (api, options) => {
  const
    theme = options.pluginOptions.quasar.theme,
    rtl = options.pluginOptions.quasar.rtlSupport

  api.chainWebpack(chain => {
    chain
      .resolve
        .alias
          .set('quasar', api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.esm.js`))
          .set('variables', api.resolve(`src/styles/quasar.variables.styl`))
          .set('quasar-variables', api.resolve(`node_modules/quasar-framework/dist/core.variables.styl`))
          .set('quasar-styl', api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.styl`))

    if (rtl) {
      const
        rtlOptions = rtl === true
          ? {}
          : rtl

      ;['css', 'scss', 'sass', 'less', 'stylus'].forEach(lang => {
        chain
          .module
          .rule(lang)
          .use('postcss-loader')
          .loader('postcss-loader')
          .tap(opt => {
            opt.plugins = () => {
              return [
                require('postcss-rtl')(rtlOptions)
              ]
            }
            return opt
          })
      })
    }
  })
}
