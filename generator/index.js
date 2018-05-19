const fs = require('fs')
const extendPluginOptions = require('../lib/extendPluginOptions')

const message = `
Documentation can be found at: http://quasar-framework.org

Quasar is relying on donations to evolve. We'd be very grateful if you can
take a look at: https://www.patreon.com/quasarframework
Any amount is very welcomed.
If invoices are required, please first contact razvan.stoenescu@gmail.com

Please give us a star on Github if you appreciate our work:
https://github.com/quasarframework/quasar

Enjoy! - Quasar Team
`

module.exports = (api, opts, rootOpts) => {
  const
    tsPath = api.resolve('./src/main.ts'),
    jsPath = api.resolve('./src/main.js'),
    hasTS = fs.existsSync(tsPath)

  const deps = {
    dependencies: {
      'quasar-framework': '^0.16.0',
      'quasar-extras': '^2.0.0'
    },
    devDependencies: {
      'stylus': '^0.54.5',
      'stylus-loader': '^3.0.1'
    }
  }

  if (opts.quasar.rtlSupport) {
    deps.devDependencies['postcss-rtl'] = '^1.2.3'
  }

  api.extendPackage(deps)

  // modify plugin options
  extendPluginOptions(api, pluginOptions => {
    pluginOptions.quasar = {
      theme: opts.quasar.theme
    }
    if (opts.quasar.rtlSupport) {
      pluginOptions.quasar.rtlSupport = true
    }
    return pluginOptions
  })

  api.render('./templates/common')
  if (opts.quasar.rtlSupport) {
    api.render('./templates/rtl')
  }
  if (opts.quasar.replaceComponents) {
    const
      extension = hasTS ? 'ts' : 'js',
      routerFile = api.resolve(`src/router.${extension}`),
      hasRouter = fs.existsSync(routerFile)

    api.render(`./templates/with${hasRouter ? '' : 'out'}-router`, opts)
    if (hasRouter) {
      api.render(`./templates/with-router-${extension}`)
    }
  }

  api.onCreateComplete(() => {
    let lines = '\n'

    const
      components = [
        'QBtn',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPage',
        'QPageContainer',
        'QToolbar',
        'QToolbarTitle',
        'QList',
        'QListHeader',
        'QItemSeparator',
        'QItem',
        'QItemSide',
        'QItemMain',
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

    if (opts.quasar.features.includes('ie')) {
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
        .forEach(part => { lines += `\n  ${part},` })
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


    // Now inject additions to main.[js|ts]
    {
      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const mainLines = content.split(/\r?\n/g).reverse()

      const index = mainLines.findIndex(line => line.match(/^import/))
      mainLines[index] += lines

      content = mainLines.reverse().join('\n')
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })
    }

    if (api.generator.hasPlugin('@vue/cli-plugin-eslint')) {
      const { spawnSync } = require('child_process')

      spawnSync('node', [
        'node_modules/@vue/cli-service/bin/vue-cli-service.js',
        'lint'
      ])
    }

    api.exitLog(message, 'info')
  })
}
