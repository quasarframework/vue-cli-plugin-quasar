// adapted from: https://gist.github.com/wietseva/ce824e3b09504131055e76a550e918ea

const fs = require('fs')
const isObject = val => val && Object(val) === val

let pluginOptions = null

module.exports = (api, cb) => {
  // Look up pluginOptions from the vue.config.js file
  // only do this once when its not yet defined
  const vueConfig = api.resolve('vue.config.js')

  if (!pluginOptions && fs.existsSync(vueConfig)) {
    let projectOptions = require(vueConfig)

    if (isObject(projectOptions.pluginOptions)) {
      pluginOptions = projectOptions.pluginOptions
    }
  }

  api.extendPackage(pkg => {
    pluginOptions = pluginOptions || {}

    // extend pluginOptions
    // with those already defined in the pkg
    if (isObject(pkg.vue) && isObject(pkg.vue.pluginOptions)) {
      Object.assign(pluginOptions, pkg.vue.pluginOptions)
    }

    pluginOptions = cb(pluginOptions)
    return {
      vue: { pluginOptions }
    }
  })
}
