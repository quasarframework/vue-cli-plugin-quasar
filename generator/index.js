const
  fs = require('fs'),
  extendPluginOptions = require('../lib/extendPluginOptions'),
  extendBabel = require('../lib/extendBabel')

const message = `
Documentation can be found at: https://quasar-framework.org

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
    tsPath = api.resolve('./src/main.ts'),
    jsPath = api.resolve('./src/main.js'),
    hasTS = fs.existsSync(tsPath)

  const deps = {
    dependencies: {
      'quasar-framework': '^0.17.0',
      'quasar-extras': '^2.0.4'
    },
    devDependencies: {
      'babel-plugin-transform-imports': '1.5.0',
      'stylus': '^0.54.5',
      'stylus-loader': '^3.0.2'
    }
  }

  if (opts.quasar.rtlSupport) {
    deps.devDependencies['postcss-rtl'] = '^1.2.3'
  }

  api.extendPackage(deps)

  // modify plugin options
  extendPluginOptions(api, (pluginOptions, transpileDependencies) => {
    pluginOptions.quasar = {
      theme: opts.quasar.theme
    }
    if (opts.quasar.rtlSupport) {
      pluginOptions.quasar.rtlSupport = true
    }
    if (opts.quasar.all) {
      pluginOptions.quasar.importAll = true
    }

    transpileDependencies.push(/[\\/]node_modules[\\/]quasar-framework[\\/]/)

    return { pluginOptions, transpileDependencies }
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
    if (!opts.quasar.all) {
      extendBabel(api, opts.quasar.theme)
    }

    let lines = '\n'

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

    // build import
    lines += `\nimport `
    if (opts.quasar.all) {
      lines += `Quasar`
    }
    else {
      lines += `{\n  Quasar, `
      components.concat(directives).concat(plugins)
        .forEach(part => { lines += `\n  ${part},` })
      lines += `\n}`
    }
    lines += ` from 'quasar'`

    // build Vue.use()
    lines += `\n\nVue.use(Quasar, {`
    lines += `\n  config: {}`

    // if not 'all' we want to include specific defaults
    if (!opts.quasar.all) {
      lines+= ',\n  components: {'
      components
        .forEach(part => { lines += `\n    ${part},` })
      lines += `\n  }`

      lines+= ',\n  directives: {'
      directives
        .forEach(part => { lines += `\n   ${part},` })
      lines += `\n  }`

      lines+= ',\n  plugins: {'
      plugins
        .forEach(part => { lines += `\n   ${part},` })
      lines += `\n  }`
    }

    if (hasLang) {
      lines += `, i18n: lang`
    }
    if (hasIconSet) {
      lines += `, iconSet: iconSet`
    }

    lines += `\n })`

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
