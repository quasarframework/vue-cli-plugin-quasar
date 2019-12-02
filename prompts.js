module.exports = [
  {
    name: 'quasar.replaceComponents',
    type: 'confirm',
    when: 'router',
    message:
      'Allow Quasar to replace App.vue, About.vue, Home.vue and (if available) router.js?',
    default: true
  },

  {
    name: 'quasar.importStrategy',
    type: 'list',
    message: 'Pick a Quasar components & directives import strategy: (can be changed later)',
    choices: [
      {
        name: '* Auto-import in-use Quasar components & directives\n    - slightly higher compile time; next to minimum bundle size; most convenient',
        value: '\'auto\'',
        short: 'Auto import',
        checked: true
      },
      {
        name: '* Manually specify what to import\n    - fastest compile time; minimum bundle size; most tedious',
        value: '\'manual\'',
        short: 'Manual'
      }
    ]
  },

  {
    name: 'quasar.cssPreprocessor',
    type: 'list',
    message: 'Pick your favorite CSS preprocessor: (can be changed later)',
    default: 'sass',
    choices: [
      {
        name: 'Sass with indented syntax (recommended)',
        value: 'sass',
        short: 'Sass'
      },
      {
        name: 'Sass with SCSS syntax (recommended)',
        value: 'scss',
        short: 'SCSS'
      },
      {
        name: 'Stylus',
        value: 'stylus'
      },
      {
        name: 'None (the others will still be available)',
        value: 'none',
        short: 'None'
      }
    ]
  },

  {
    name: 'quasar.iconSet',
    type: 'list',
    message: 'Choose Quasar Icon Set',
    choices: [
      {
        name: 'Material Icons (recommended)',
        value: 'material-icons',
        short: 'Material'
      },
      {
        name: 'Material Icons Outlined',
        value: 'material-icons-outlined',
        short: 'Material Outlined'
      },
      {
        name: 'Material Icons Round',
        value: 'material-icons-round',
        short: 'Material Round'
      },
      {
        name: 'Material Icons Sharp',
        value: 'material-icons-sharp',
        short: 'Material Sharp'
      },
      {
        name: 'Fontawesome',
        value: 'fontawesome',
        short: 'Fontawesome'
      },
      {
        name: 'Ionicons',
        value: 'ionicons',
        short: 'Ionicons'
      },
      {
        name: 'MDI',
        value: 'mdi',
        short: 'MDI'
      },
      {
        name: 'Eva Icons',
        value: 'eva-icons',
        short: 'Eva'
      }
    ]
  },

  {
    name: 'quasar.lang',
    type: 'string',
    message:
      'Default Quasar language pack - one from https://github.com/quasarframework/quasar/tree/dev/ui/lang',
    default: 'en-us',
    validate: opt => opt && opt.length >= 2
  },

  {
    name: 'quasar.rtlSupport',
    type: 'confirm',
    message: 'Use RTL support?',
    default: false
  },

  {
    name: 'quasar.features',
    type: 'checkbox',
    message: 'Select features:',
    choices: [
      {
        name: 'IE11 support',
        value: 'ie'
      },
      {
        name: 'Roboto font',
        value: 'roboto-font'
      },
      {
        name: 'Material Icons (recommended)',
        value: 'material-icons',
        short: 'Material'
      },
      {
        name: 'Material Icons Outlined',
        value: 'material-icons-outlined',
        short: 'Material Outlined'
      },
      {
        name: 'Material Icons Round',
        value: 'material-icons-round',
        short: 'Material Round'
      },
      {
        name: 'Material Icons Sharp',
        value: 'material-icons-sharp',
        short: 'Material Sharp'
      },
      {
        name: 'Fontawesome',
        value: 'fontawesome',
        short: 'Fontawesome'
      },
      {
        name: 'Ionicons',
        value: 'ionicons',
        short: 'Ionicons'
      },
      {
        name: 'MDI',
        value: 'mdi',
        short: 'MDI'
      },
      {
        name: 'Eva Icons',
        value: 'eva-icons',
        short: 'Eva'
      }
    ]
  }
]
