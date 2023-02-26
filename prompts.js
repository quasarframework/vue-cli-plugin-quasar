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
    name: 'quasar.cssPreprocessor',
    type: 'list',
    message: 'Pick your favorite CSS preprocessor:',
    default: 'sass',
    choices: [
      {
        name: 'Sass with indented syntax',
        value: 'sass',
        short: 'Sass'
      },
      {
        name: 'Sass with SCSS syntax',
        value: 'scss',
        short: 'SCSS'
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
    default: 'en-US',
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
