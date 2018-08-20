const fs = require('fs')

function updateBabel (babel, theme) {
  babel.plugins = babel.plugins || []
  babel.plugins.push([
    'transform-imports', {
      quasar: {
        transform: `quasar-framework/dist/babel-transforms/imports.${theme}.js`,
        preventFullImport: true
      }
    }
  ])
  return babel
}

module.exports = function (api, theme) {
  const
    babelPath = api.resolve('babel.config.js'),
    packageJsonPath = api.resolve('package.json')

  let content, filePath

  if (fs.existsSync(babelPath)) {
    filePath = babelPath
    const config = updateBabel(require(filePath), theme)
    content = `module.exports = ${JSON.stringify(config, null, 2)}`
  }
  else if (fs.existsSync(packageJsonPath)) {
    filePath = packageJsonPath
    const config = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    config.babel = updateBabel(config.babel || {}, theme)
    content = JSON.stringify(config, null, 2)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
}
