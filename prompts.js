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
    name: 'quasar.treeShake',
    type: 'confirm',
    message:
      'Treeshake Quasar? (you\'ll need to import the components, directives and plugins that you use yourself)',
    default: true
  },
  {
    name: 'quasar.rtlSupport',
    type: 'confirm',
    message: 'Use RTL support?',
    default: false
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
        short: 'MDI'
      }
    ]
  },
  {
    name: 'quasar.lang',
    type: 'string',
    message:
      'Quasar language pack - one from https://github.com/quasarframework/quasar/tree/dev/quasar/lang',
    default: 'en-us',
    validate: opt => opt && opt.length >= 2
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
        name: 'Material icons',
        value: 'material-icons',
        short: 'Material'
      },
      {
        name: 'Fontawesome icons',
        value: 'fontawesome',
        short: 'Fontawesome'
      },
      {
        name: 'Ionicons icons',
        value: 'ionicons',
        short: 'Ionicons'
      },
      {
        name: 'MDI icons',
        value: 'mdi',
        short: 'MDI'
      },
      {
        name: 'Eva icons',
        value: 'eva-icons',
        short: 'Eva'
      }
    ]
  }
]
