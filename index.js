module.exports = (api, options) => {
  const pluginOptions = options.pluginOptions
    ? options.pluginOptions.quasar || {}
    : {}
  if (pluginOptions.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  api.chainWebpack(chain => {
    const theme = process.env.QUASAR_THEME || 'mat'
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
      details: `See https://github.com/quasarframework/vue-cli-plugin-quasar for more details about this plugin.`
    },
    async args => {
      const Builder = require('./lib/builder')
      const builder = new Builder(args, pluginOptions, api)
      await builder.buildAll()
    }
  )

  api.registerCommand(
    'serve:quasar',
    {
      description: 'serve app with Quasar',
      usage:
        'vue-cli-service serve:quasar (-t|--theme) (mat|ios) (-p|--platform) (web|electron|capacitor)',
      details: `See https://github.com/quasarframework/vue-cli-plugin-quasar for more details about this plugin.`
    },
    async (args, rawArgs) => {
      const chalk = require('chalk')
      const commands = {
        web: 'serve',
        electron: 'electron:serve',
        capacitor: 'capacitor:serve'
      }
      const platform = args.p || args.platform || 'web'
      const theme = args.t || args.theme || 'mat'
      if (Object.keys(commands).indexOf(platform) === -1) {
        throw new Error('Please specify a valid platform')
      }
      if (theme !== 'mat' && theme !== 'ios') {
        throw new Error('Please specify a valid theme')
      }
      if (platform === 'electron' && !api.hasPlugin('electron-builder')) {
        throw new Error(
          `To build for Electron, Vue CLI Plugin Electron Builder is required. Install it with ${chalk.bold(
            'vue add electron-builder'
          )}.`
        )
      }
      if (platform === 'capacitor' && !api.hasPlugin('capacitor')) {
        throw new Error(
          `To build for Capacitor, Vue CLI Plugin Capacitor Builder is required. Install it with ${chalk.bold(
            'vue add capacitor'
          )}.`
        )
      }
      process.env.QUASAR_THEME = theme

      // Remove args
      delete args.p
      delete args.platform
      delete args.t
      delete args.theme
      const removeArg = (arg, count) => {
        const index = rawArgs.indexOf(arg)
        if (index !== -1) rawArgs.splice(index, count)
      }
      removeArg('-p', 2)
      removeArg('--platform', 2)
      removeArg('-t', 2)
      removeArg('-theme', 2)

      // Start dev server
      api.service.run(commands[platform], args, rawArgs)
    }
  )
}

module.exports.defaultModes = {
  'build:quasar': 'production',
  'serve:quasar': 'development'
}
