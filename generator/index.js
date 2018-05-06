const extendPluginOptions = require('../lib/extendPluginOptions')

module.exports = (api, opts, rootOpts) => {
  api.extendPackage({
    dependencies: {
      'quasar-framework': '^0.15.10',
      'quasar-extras': '^1.0.3'
    },
    devDependencies: {
      'stylus': '^0.54.5',
      'stylus-loader': '^3.0.1'
    }
  })

  // modify plugin options
  extendPluginOptions(api, pluginOptions => {
    pluginOptions.quasar = {
      theme: opts.quasar.theme
    }
    return pluginOptions
  })

  api.render('./templates')

  api.onCreateComplete(() => {
    let lines = '\n'

    const
      components = [
        'QBtn'
      ],
      directives = [],
      plugins = []

    const
      hasLang = opts.quasar.i18n !== 'en-us',
      hasIconSet = opts.quasar.iconSet !== 'material-icons'


    if (!opts.quasar.features.includes(opts.quasar.iconSet)) {
      opts.quasar.features.push(opts.quasar.iconSet)
    }

    lines += `\nimport './styles/quasar.styl'`

    if (opts.quasar.ie) {
      lines += `\nimport 'quasar-framework/dist/quasar.ie.polyfills'`
    }
    if (hasIconSet) {
      lines += `\nimport iconSet from 'quasar-framework/icons/${opts.quasar.iconSet}'`
    }
    if (hasLang) {
      lines += `\nimport lang from 'quasar-framework/i18n/${opts.quasar.i18n}'`
    }
    opts.quasar.features
      .filter(feat => feat !== 'ie')
      .forEach(feat => {
        lines += `\nimport 'quasar-extras/${feat}'`
      })

    lines += `\nimport Quasar, `
    if (opts.quasar.all) {
      lines += `* as All`
    }
    else {
      lines += `{`
      components.concat(directives).concat(plugins)
        .forEach(part => { lines += `\n  ${part}` })
      lines += `\n}`
    }
    lines += ` from 'quasar'`

    lines += `\n\nVue.use(Quasar, {`
    if (hasIconSet) {
      lines += `\n  iconSet: iconSet,`
    }
    if (hasLang) {
      lines += `\n  i18n: lang,`
    }

    if (opts.quasar.all) {
      lines += `\n  components: All,`
      lines += `\n  directives: All,`
      lines += `\n  plugins: All`
    }
    else {
      lines += `\n  components: {`
      components.forEach(comp => {
        lines += `\n    ${comp},`
      })
      lines += `\n  },`

      lines += `\n  directives: {`
      directives.forEach(directive => {
        lines += `\n    ${directive},`
      })
      lines += `\n  },`

      lines += `\n  plugins: {`
      plugins.forEach(plugin => {
        lines += `\n    ${plugin},`
      })
      lines += `\n  }`
    }

    lines += `\n})`


    // Now inject additions to main.js
    {
      const tsPath = api.resolve('./src/main.ts')
      const jsPath = api.resolve('./src/main.js')

      const fs = require('fs')
      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const mainLines = content.split(/\r?\n/g).reverse()

      const index = mainLines.findIndex(line => line.match(/^import/))
      mainLines[index] += lines

      content = mainLines.reverse().join('\n')
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })
    }
  })
}
