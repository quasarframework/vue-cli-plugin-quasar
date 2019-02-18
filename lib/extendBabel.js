const fs = require('fs')

function updateBabel(babel, theme, v1) {
  babel.plugins = babel.plugins || []
  babel.plugins.push([
    'transform-imports',
    {
      quasar: {
        transform: `quasar${
          v1 ? '' : '-framework'
        }/dist/babel-transforms/imports${v1 ? '' : '.' + theme}.js`,
        preventFullImport: true
      }
    }
  ])
  return babel
}

module.exports = function(api, opts) {
  const babelPath = api.resolve('babel.config.js'),
    packageJsonPath = api.resolve('package.json')

  let content, filePath

  if (fs.existsSync(babelPath)) {
    filePath = babelPath
    const config = updateBabel(require(filePath), opts.theme, opts.v1)
    content = `module.exports = ${JSON.stringify(config, null, 2)}`
  } else if (fs.existsSync(packageJsonPath)) {
    filePath = packageJsonPath
    const config = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    config.babel = updateBabel(config.babel || {}, theme)
    content = JSON.stringify(config, null, 2)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
}
