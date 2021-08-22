const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const getDevlandFile = require('./lib/get-devland-file')
const { version } = getDevlandFile('quasar/package.json')

const transformAssetUrls = getDevlandFile('quasar/dist/transforms/loader-asset-urls.json')

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

    chain.plugin('define-quasar')
      .use(webpack.DefinePlugin, [{
        __QUASAR_VERSION__: `'${version}'`,
        __QUASAR_SSR__: false,
        __QUASAR_SSR_SERVER__: false,
        __QUASAR_SSR_CLIENT__: false,
        __QUASAR_SSR_PWA__: false
      }])

    chain.performance.maxEntrypointSize(512000)

    const strategy = options.pluginOptions.quasar.importStrategy || 'kebab'

    chain.module.rule('vue').use('vue-loader').tap(options => ({
      ...options,
      transformAssetUrls: merge(
        {
          base: null,
          includeAbsolute: false,
          tags: {
            video: ['src', 'poster'],
            source: ['src'],
            img: ['src'],
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href']
          }
        },
        options.transformAssetUrls || {},
        transformAssetUrls
      )
    }))

    if (['kebab', 'pascal', 'combined'].includes(strategy)) {
      chain.module.rule('vue')
        .use('vue-auto-import-quasar')
        .loader(path.join(__dirname, 'lib/loader.vue.auto-import-quasar.js'))
        .options({ strategy })
        .before('cache-loader')

      chain.module.rule('js-transform-quasar-imports')
        .test(/\.(t|j)sx?$/)
        .use('js-transform-quasar-imports')
          .loader(path.join(__dirname, 'lib/loader.js.transform-quasar-imports.js'))
    }
    else {
      console.error(`Incorrect setting for quasar > importStrategy (${strategy})`)
      console.error(`Use one of: 'kebab', 'pascal', 'combined'.`)
      console.log()
      process.exit(1)
    }
  })
}
