const yargs = require('yargs')
const chalk = require('chalk')
const unparse = require('unparse-args')

module.exports = class Builder {
  constructor (args, pluginOptions, api) {
    args = args || {}
    pluginOptions = pluginOptions || {}
    this.targets = []

    const addTarget = (theme, platform, targetArgs) => {
      targetArgs =
        targetArgs && typeof targetArgs === 'object' ? targetArgs : {}
      this.targets.push({ theme, platform, args: targetArgs })
    }
    const setTargets = (theme, targetArgs) => {
      // Converts theme and args into per-platform targets
      if (
        (!targetArgs.electron && !targetArgs.cordova) ||
        (targetArgs.web && targetArgs.web !== 'false')
      ) {
        // Add web target if no targets are provided or --web is set
        addTarget(theme, 'web', targetArgs.web)
      }
      if (targetArgs.electron) {
        addTarget(theme, 'electron', targetArgs.electron)
      }
      if (targetArgs.cordova) {
        addTarget(theme, 'cordova', targetArgs.cordova)
      }
    }
    const parseThemeArgs = theme => {
      // Takes a theme, sets targets with theme-specific args mixed with general args
      if (typeof args[theme] === 'string') {
        // Mix general args with theme-specific args
        setTargets(theme, {
          ...args,
          ...yargs.parse(args[theme])
        })
      } else {
        // Use general args
        setTargets(theme, args)
      }
    }
    if (args.config) {
      // Get config from pluginOptions
      const config = pluginOptions.configurations[args.config]
      if (config.mat || config.ios) {
        // Set targets for each theme
        if (config.mat) setTargets('mat', { ...config, ...(config.mat || {}) })
        if (config.ios) setTargets('ios', { ...config, ...(config.ios || {}) })
      } else {
        // Set targets for default theme (mat is default)
        setTargets(pluginOptions.defaultTheme || 'mat', config)
      }
    } else {
      if (args.mat || args.ios) {
        // Parse args for each theme
        if (args.mat) parseThemeArgs('mat')
        if (args.ios) parseThemeArgs('ios')
      } else {
        // Parse args for default theme (mat is default)
        parseThemeArgs(pluginOptions.defaultTheme || 'mat')
      }
    }
    this.api = api
    this.pluginOptions = pluginOptions
    this.args = args
  }
  async buildWeb () {
    const { api, log } = this
    const targets = this.targets.filter(({ platform }) => platform === 'web')
    // forEach() doesn't work with async
    for (const { theme, args } of targets) {
      log('web', theme)
      process.env.QUASAR_THEME = theme
      await api.service.run('build', {
        ...args,
        dest: `${this.pluginOptions.outputDir || 'dist'}/web-${theme}`
      })
    }
  }
  async buildElectron () {
    const { api, log } = this
    const targets = this.targets.filter(
      ({ platform }) => platform === 'electron'
    )
    // forEach() doesn't work with async
    for (const { theme, args } of targets) {
      if (!api.hasPlugin('electron-builder')) {
        throw new Error(
          `To build for Electron, Vue CLI Plugin Electron Builder is required. Install it with ${chalk.bold(
            'vue add electron-builder'
          )}.`
        )
      }
      log('electron', theme)
      process.env.QUASAR_THEME = theme
      await api.service.run(
        'electron:build',
        {
          ...args,
          dest: `${this.pluginOptions.outputDir || 'dist'}/electron-${theme}`
        },
        // Electron Builder uses raw args
        ['First arg is removed', ...unparse(args)]
      )
    }
  }
  async buildAll () {
    await this.buildWeb()
    await this.buildElectron()
  }
  log (platform, theme) {
    console.log(
      chalk.black.bgCyan(
        `Building for ${chalk.magenta(platform)} with ${chalk.magenta(
          theme
        )} theme:`
      )
    )
  }
}
