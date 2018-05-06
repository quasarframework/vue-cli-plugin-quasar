module.exports = [
  {
    name: 'quasar.theme',
    type: 'list',
    message: 'Select Quasar Theme:',
    choices: [
      {
        name: 'Material Design',
        value: 'mat'
      },
      {
        name: 'iOS Theme',
        value: 'ios'
      }
    ]
  },
  {
    name: 'quasar.replaceComponents',
    type: 'confirm',
    when: 'router',
    message: 'Allow Quasar to replace App.vue, About.vue, Home.vue and (if available) router.js?',
    default: true
  },
  {
    name: 'quasar.all',
    type: 'confirm',
    message: 'Import all Quasar components, directives and plugins?',
    default: false
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
    message: 'Choose Icon Set',
    choices: [
      {
        name: 'Material Icons (recommended)',
        value: 'material-icons',
        short: 'Material Icons'
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
      }
    ]
  },
  {
    name: 'quasar.i18n',
    type: 'string',
    message: 'Quasar i18n lang - one from https://github.com/quasarframework/quasar/tree/dev/i18n',
    default: 'en-us',
    validate: opt => opt && opt.length >= 2
  },
  {
    name: 'quasar.features',
    type: 'checkbox',
    message: 'Select features:',
    choices: [
      {
        name: 'Animations',
        value: 'animate'
      },
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
        short: 'Material Icons'
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
      }
    ]
  }
]
