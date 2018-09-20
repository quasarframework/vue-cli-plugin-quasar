const yargs = require('yargs')

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
}
