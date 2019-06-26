const fs = require('fs')

function updateBabel(babel) {
  babel.plugins = babel.plugins || []
  babel.plugins.push([
    'transform-imports',
    {
      quasar: {
        transform: `quasar/dist/babel-transforms/imports.js`,
        preventFullImport: true
      }
    }
  ])
  return babel
}

module.exports = function(api) {
  const
    babelPath = api.resolve('babel.config.js'),
    packageJsonPath = api.resolve('package.json')

  let content, filePath

  if (fs.existsSync(babelPath)) {
    filePath = babelPath
    const config = updateBabel(require(filePath))
    content = `module.exports = ${JSON.stringify(config, null, 2)}`
  }
  else if (fs.existsSync(packageJsonPath)) {
    filePath = packageJsonPath
    const config = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    config.babel = updateBabel(config.babel || {})
    content = JSON.stringify(config, null, 2)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
}
