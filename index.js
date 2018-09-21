module.exports = (api, options) => {
  const pluginOptions = options.pluginOptions
    ? options.pluginOptions.quasar || {}
    : {}
  if (pluginOptions.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    const theme = process.env.QUASAR_THEME
    const importAll = pluginOptions.importAll

    if (!importAll) {
      chain.resolve.extensions.prepend(`.${theme}.js`)

      chain.plugin('define').tap(args => {
        const { 'process.env': env, ...rest } = args[0]
        return [
          {
            'process.env': Object.assign({}, env, {
              THEME: JSON.stringify(theme)
            }),
            ...rest
          }
        ]
      })
    }

    chain.resolve.alias
      .set(
        'quasar',
        importAll
          ? api.resolve(
            `node_modules/quasar-framework/dist/quasar.${theme}.esm.js`
          )
          : 'quasar-framework'
      )
      .set('variables', api.resolve(`src/styles/quasar.variables.styl`))
      .set(
        'quasar-variables',
        api.resolve(`node_modules/quasar-framework/src/css/core.variables.styl`)
      )
      .set(
        'quasar-styl',
        api.resolve(`node_modules/quasar-framework/dist/quasar.${theme}.styl`)
      )
      .set(
        'quasar-addon-styl',
        api.resolve(`node_modules/quasar-framework/src/css/flex-addon.styl`)
      )

    chain.performance.maxEntrypointSize(512000)
  })
  api.registerCommand(
    'build:quasar',
    {
      description: 'build app with Quasar',
      usage: 'vue-cli-service build:quasar [args]',
      details: `See https://github.com/quasarframework/vue-cli-plugin-quasar/tree/dev for more details about this plugin.`
    },
    async args => {
      const Builder = require('./lib/builder')
      const builder = new Builder(args, pluginOptions, api)
      await builder.buildAll()
    }
  )
}

module.exports.defaultModes = {
  'build:quasar': 'production'
}
