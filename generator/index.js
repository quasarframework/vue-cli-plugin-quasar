const fs = require('fs'),
  extendPluginOptions = require('../lib/extendPluginOptions'),
  extendBabel = require('../lib/extendBabel')

const message = `
Documentation can be found at: https://quasar.dev

Quasar is relying on donations to evolve. We'd be very grateful
if you can read our manifest on "Why donations are important":
https://quasar.dev/why-donate
Donation campaign: https://donate.quasar.dev Any amount is very
welcomed. If invoices are required, please first contact
razvan@quasar.dev

Please give us a star on Github if you appreciate our work:
https://github.com/quasarframework/quasar

Enjoy! - Quasar Team
`

const iconMap = {
  ionicons: 'ionicons-v4',
  fontawesome: 'fontawesome-v5',
  mdi: 'mdi-v3'
}

module.exports = (api, opts) => {
  const components = [
    'QLayout',
    'QHeader',
    'QDrawer',
    'QPageContainer',
    'QPage',
    'QToolbar',
    'QToolbarTitle',
    'QBtn',
    'QIcon',
    'QList',
    'QItem',
    'QItemSection',
    'QItemLabel'
  ]

  const directives = []
  const plugins = []

  const
    quasarPath = api.resolve('./src/quasar.js'),
    tsPath = api.resolve('./src/main.ts'),
    jsPath = api.resolve('./src/main.js'),
    hasTS = fs.existsSync(tsPath)

  const dependencies = {
    quasar: '^1.0.0',
    '@quasar/extras': '^1.0.0'
  }

  const deps = {
    dependencies,
    devDependencies: {
      'babel-plugin-transform-imports': '1.5.0',
      stylus: '^0.54.5',
      'stylus-loader': '^3.0.2'
    }
  }

  if (opts.quasar.rtlSupport) {
    deps.devDependencies['postcss-rtl'] = '^1.2.3'
  }

  api.extendPackage(deps)

  // modify plugin options
  extendPluginOptions(api, (pluginOptions, transpileDependencies) => {
    pluginOptions.quasar = pluginOptions.quasar || {}

    if (opts.quasar.rtlSupport) {
      pluginOptions.quasar.rtlSupport = opts.quasar.rtlSupport
    }

    if (opts.quasar.treeShake) {
      pluginOptions.quasar.treeShake = opts.quasar.treeShake
    }

    transpileDependencies.push(/[\\/]node_modules[\\/]quasar[\\/]/)

    return { pluginOptions, transpileDependencies }
  })

  api.render('./templates/common')

  if (opts.quasar.rtlSupport) {
    api.render('./templates/rtl')
  }

  if (opts.quasar.replaceComponents) {
    const extension = hasTS ? 'ts' : 'js',
      routerFile = api.resolve(`src/router.${extension}`),
      hasRouter = fs.existsSync(routerFile)

    api.render(`./templates/with${hasRouter ? '' : 'out'}-router-base`, opts)
    api.render(
      `./templates/with${hasRouter ? '' : 'out'}-router`,
      opts
    )
    if (hasRouter) {
      api.render(`./templates/with-router-${extension}`)
    }
  }

  api.onCreateComplete(() => {
    if (opts.quasar.treeShake) {
      extendBabel(api)
    }

    let lines = `import Vue from 'vue'\n`

    const
      hasIconSet = opts.quasar.iconSet !== 'material-icons',
      hasLang = opts.quasar.lang !== 'en-us'

    if (!opts.quasar.features.includes(opts.quasar.iconSet)) {
      opts.quasar.features.push(opts.quasar.iconSet)
    }

    lines += `\nimport './styles/quasar.styl'`

    if (opts.quasar.features.includes('ie')) {
      lines += `\nimport 'quasar/dist/quasar.ie.polyfills'`
    }

    if (hasIconSet) {
      const set = iconMap[opts.quasar.iconSet] || opts.quasar.iconSet
      lines += `\nimport iconSet from 'quasar/icon-set/${set}.js'`
    }

    if (hasLang) {
      lines += `\nimport lang from 'quasar/lang/${opts.quasar.lang}.js'`
    }

    opts.quasar.features
      .filter(feat => feat !== 'ie')
      .forEach(feat => {
        feat = iconMap[feat] || feat
        lines += `\nimport '@quasar/extras/${feat}/${feat}.css'`
      })

    // build import
    lines += `\nimport `
    if (opts.quasar.treeShake) {
      lines += `{\n  Quasar, `
      components
        .concat(directives)
        .concat(plugins)
        .forEach(part => {
          lines += `\n  ${part},`
        })
      lines += `\n}`
    } else {
      lines += `Quasar`
    }
    lines += ` from 'quasar'`

    // build Vue.use()
    lines += `\n\nVue.use(Quasar, {`
    lines += `\n  config: {}`

    // if tree-shake was chosen then we want to include specific defaults
    if (opts.quasar.treeShake) {
      lines += ',\n  components: {'
      components.forEach(part => {
        lines += `\n    ${part},`
      })
      lines += `\n  }`

      lines += ',\n  directives: {'
      directives.forEach(part => {
        lines += `\n   ${part},`
      })
      lines += `\n  }`

      lines += ',\n  plugins: {'
      plugins.forEach(part => {
        lines += `\n   ${part},`
      })
      lines += `\n  }`
    }

    if (hasLang) {
      lines += `,\n  lang: lang`
    }
    if (hasIconSet) {
      lines += `,\n  iconSet: iconSet`
    }

    lines += `\n })`

    // Now inject additions to main.[js|ts]
    {
      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const mainLines = content.split(/\r?\n/g).reverse()

      const index = mainLines.findIndex(line => line.match(/^import/))
      mainLines[index] += `\nimport './quasar'`

      content = mainLines.reverse().join('\n')
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })

      fs.writeFileSync(quasarPath, lines, { encoding: 'utf8' })
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
