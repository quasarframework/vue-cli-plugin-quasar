// adapted from: https://gist.github.com/wietseva/ce824e3b09504131055e76a550e918ea

const fs = require('fs')
const isObject = val => val && Object(val) === val

module.exports = (api, cb) => {
  let pluginOptions, transpileDependencies
  const vueConfig = api.resolve('vue.config.js')

  if (fs.existsSync(vueConfig)) {
    let projectOptions = require(vueConfig)

    if (isObject(projectOptions.pluginOptions)) {
      pluginOptions = projectOptions.pluginOptions
    }
    if (Array.isArray(projectOptions.transpileDependencies)) {
      transpileDependencies = projectOptions.transpileDependencies
    }
  }

  api.extendPackage(pkg => {
    transpileDependencies = transpileDependencies || []
    pluginOptions = pluginOptions || {}

    // extend pluginOptions
    // with those already defined in the pkg
    if (isObject(pkg.vue)) {
      if (isObject(pkg.vue.pluginOptions)) {
        Object.assign(pluginOptions, pkg.vue.pluginOptions)
      }
      if (Array.isArray(pkg.vue.transpileDependencies)) {
        transpileDependencies = pkg.vue.transpileDependencies
      }
    }

    return { vue: cb(pluginOptions, transpileDependencies) }
  })
}
