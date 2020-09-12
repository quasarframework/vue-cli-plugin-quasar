function getDevlandFile (name) {
  return require(
    require.resolve(name, {
      paths: [ __dirname ]
    })
  )
}

const data = getDevlandFile('quasar/dist/babel-transforms/auto-import.json')
const quasarImportMap = require('quasar/dist/babel-transforms/imports');

const compRegex = {
  '?kebab': new RegExp(data.regex.kebabComponents || data.regex.components, 'g'),
  '?pascal': new RegExp(data.regex.pascalComponents || data.regex.components, 'g'),
  '?combined': new RegExp(data.regex.components, 'g')
}

// regex to match functional components
const funcCompRegex = new RegExp(
  'var\\s+component\\s*=\\s*normalizer\\((?:[^,]+,){3}\\s*true,'
)

const dirRegex = new RegExp(data.regex.directives, 'g')

function extract (content, form) {
  let comp = content.match(compRegex[form]) || []
  let dir = content.match(dirRegex) || []

  if (comp.length) {
    // avoid duplicates
    comp = Array.from(new Set(comp))

    // map comp names only if not pascal-case already
    if (form !== '?pascal') {
      comp = comp.map(name => data.importName[name])
    }

    if (form === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // so avoid duplicates
      comp = Array.from(new Set(comp))
    }
  }

  if (dir.length) {
    dir = Array.from(new Set(dir))
      .map(name => data.importName[name])
  }

  return {
    comp,
    dir,
  }
}

module.exports = function (content) {
  if (!this.resourceQuery && funcCompRegex.test(content) === false) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const { comp, dir } = extract(file, this.query)

    if (comp.length || dir.length) {
      const index = this.mode === 'development'
        ? content.indexOf('/* hot reload */')
        : -1


      let code = '\n';
      comp.concat(dir).forEach(quasarComponent => {
        code += `import ${ quasarComponent } from '${ quasarImportMap(quasarComponent) }';\n`
      });

      if (comp.length) {
        code += `component.options.components = Object.assign(Object.create(component.options.components || null), component.options.components || {}, {${ comp.join(',') }})\n`;
      }
      if (dir.length) {
        code += `component.options.directives = Object.assign(Object.create(component.options.directives || null), component.options.directives || {}, {${ dir.join(',') }})\n`;
      }

      return index === -1
        ? content + code
        : content.slice(0, index) + code + content.slice(index)
    }
  }

  return content
}
