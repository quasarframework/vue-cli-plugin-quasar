const fs = require('fs')
const extendPluginOptions = require('../lib/extendPluginOptions')

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
  mdi: 'mdi-v4'
}

const plugins = []

module.exports = (api, opts) => {
  const
    quasarPath = api.resolve('./src/quasar-user-options.js'),
    tsPath = api.resolve('./src/main.ts'),
    jsPath = api.resolve('./src/main.js'),
    hasTS = fs.existsSync(tsPath)

  const dependencies = {
    quasar: '^2.0.0',
    '@quasar/extras': '^1.0.0'
  }

  const deps = {
    dependencies,
    devDependencies: {}
  }

  if (['sass', 'scss'].includes(opts.quasar.cssPreprocessor)) {
    Object.assign(deps.devDependencies, {
      'sass': '1.32.12',
      'sass-loader': '^12.0.0'
    })
  }

  if (opts.quasar.rtlSupport) {
    deps.devDependencies['postcss-rtl'] = '^3.5.3'
  }

  api.extendPackage(deps)

  // modify plugin options
  extendPluginOptions(api, (pluginOptions, transpileDependencies) => {
    pluginOptions.quasar = Object.assign(
      pluginOptions.quasar || {},
      {
        importStrategy: 'kebab',
        rtlSupport: opts.quasar.rtlSupport
      }
    )

    transpileDependencies.push('quasar')

    return { pluginOptions, transpileDependencies }
  })

  api.render('./templates/common')

  if (opts.quasar.rtlSupport) {
    api.render('./templates/rtl')
  }

  if (opts.quasar.cssPreprocessor !== 'none') {
    api.render(`./templates/${opts.quasar.cssPreprocessor}`)
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
    let qFileLines = ''

    const
      hasIconSet = opts.quasar.iconSet !== 'material-icons',
      hasLang = opts.quasar.lang !== 'en-US'

    if (!opts.quasar.features.includes(opts.quasar.iconSet)) {
      opts.quasar.features.push(opts.quasar.iconSet)
    }

    if (opts.quasar.cssPreprocessor !== 'none') {
      qFileLines += `\nimport './styles/quasar.${opts.quasar.cssPreprocessor}'`
    }
    else {
      qFileLines += `\nimport 'quasar/dist/quasar.css'`
    }

    if (hasIconSet) {
      const set = iconMap[opts.quasar.iconSet] || opts.quasar.iconSet
      qFileLines += `\nimport iconSet from 'quasar/icon-set/${set}.js'`
    }

    if (hasLang) {
      qFileLines += `\nimport lang from 'quasar/lang/${opts.quasar.lang}.js'`
    }

    opts.quasar.features
      .forEach(feat => {
        feat = iconMap[feat] || feat
        qFileLines += `\nimport '@quasar/extras/${feat}/${feat}.css'`
      })

    qFileLines += `\n\n// To be used on app.use(Quasar, { ... })\nexport default {`
    qFileLines += `\n  config: {}`

    qFileLines += ',\n  plugins: {'
    plugins.forEach(part => {
      qFileLines += `\n   ${part},`
    })
    qFileLines += `\n  }`

    if (hasLang) {
      qFileLines += `,\n  lang: lang`
    }
    if (hasIconSet) {
      qFileLines += `,\n  iconSet: iconSet`
    }

    qFileLines += `\n}`

    // Now inject additions to main.[js|ts]
    {
      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const mainLines = content.split(/\r?\n/g).reverse()

      const index = mainLines.findIndex(line => line.match(/^import/))
      mainLines[index] += `\nimport { Quasar } from 'quasar'\nimport quasarUserOptions from './quasar-user-options'`

      content = mainLines.reverse().join('\n')
      content = content.replace('createApp(App)', `createApp(App).use(Quasar, quasarUserOptions)`)
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })

      fs.writeFileSync(quasarPath, qFileLines, { encoding: 'utf8' })
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
