const fs = require('fs')
const path = require('path')

function getCssPreprocessor (api) {
  return ['sass', 'scss', 'styl'].find(ext => {
    return fs.existsSync(
      api.resolve('src/styles/quasar.variables.' + ext)
    )
  })
}

module.exports = (api, options) => {
  if (options.pluginOptions.quasar.rtlSupport) {
    process.env.QUASAR_RTL = true
  }

  const cssPreprocessor = getCssPreprocessor(api)
  const srcCssExt = cssPreprocessor === 'scss' ? 'sass' : cssPreprocessor

  api.chainWebpack(chain => {
    cssPreprocessor && chain.resolve.alias
      .set(
        'quasar-variables',
        api.resolve(`src/styles/quasar.variables.${cssPreprocessor}`)
      )
      .set(
        'quasar-variables-styl',
        `quasar/src/css/variables.${srcCssExt}`
      )
      .set(
        'quasar-styl',
        `quasar/dist/quasar.${srcCssExt}`
      )
      .set(
        'quasar-addon-styl',
        `quasar/src/css/flex-addon.${srcCssExt}`
      )

    chain.performance.maxEntrypointSize(512000)

    const strategy = options.pluginOptions.quasar.importStrategy

    if (['kebab', 'pascal', 'combined'].includes(strategy)) {
      chain.module.rule('vue')
        .use('quasar-auto-import')
        .loader(path.join(__dirname, 'lib/loader.auto-import.js'))
        .options(strategy)
        .before('cache-loader')
    }
    else if (![void 0, 'manual'].includes(strategy)) {
      console.error(`Incorrect setting for quasar > importStrategy (${strategy})`)
      console.error(`Use one of: 'kebab', 'pascal', 'combined', 'manual'.`)
      console.log()
      process.exit(1)
    }
  })
}
