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
        name: `Auto-import in-use Quasar components & directives (kebab-case, can be later changed to 'pascal'/'combined'/'manual')`,
        value: 'kebab',
        short: 'Auto import (kebab-case)',
        checked: true
      },
      {
        name: 'Manually specify what to import',
        value: 'manual',
        short: 'Manual'
      }
    ]
  },

  {
    name: 'quasar.cssPreprocessor',
    type: 'list',
    message: 'Pick your favorite CSS preprocessor:',
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
        value: 'styl',
        short: 'Stylus'
      },
      {
        name: `None (style variables won't be available)`,
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
