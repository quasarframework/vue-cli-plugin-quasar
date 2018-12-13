const plugin = require('../index')
const Builder = require('../lib/builder')

const mockBuilder = {
  buildAll: jest.fn(() => Promise.resolve())
}
jest.mock('../lib/builder', () => jest.fn(() => mockBuilder))
// #region runCommand
const serviceRun = jest.fn().mockResolvedValue({ url: 'serveUrl' })
const runCommand = async (command, options = {}, args = {}, rawArgs = []) => {
  if (!args._) args._ = []
  let commands = {}
  // Run the plugin, saving it's registered commands
  const mockApi = {
    //   Make app think typescript plugin is installed
    hasPlugin: jest.fn().mockReturnValue(true),
    registerCommand: jest.fn().mockImplementation((name, options, command) => {
      // Save registered commands
      commands[name] = command
    }),
    // So we can ensure that files were resolved properly
    resolve: jest.fn(path => 'projectPath/' + path),
    chainWebpack: jest.fn(),
    service: {
      // Mock api.service.run('build/serve')
      run: serviceRun
    }
  }
  plugin(mockApi, options)
  // Run the provided command
  await commands[command](args, rawArgs)
}
// #endregion

describe('build:quasar', () => {
  test('Invokes Builder with args', async () => {
    await runCommand('build:quasar', {}, { shouldBe: 'expected' })
    expect(Builder).toBeCalledWith(
      { shouldBe: 'expected', _: [] },
      {},
      expect.anything()
    )
  })

  test('Build is started', async () => {
    await runCommand('build:quasar')
    expect(mockBuilder.buildAll).toBeCalled()
  })
})

describe.each(['web', 'electron', 'capacitor'])('serve:quasar %s', platform => {
  test.each(['t', 'theme'])('Sets proper theme', async arg => {
    const args = {}

    // Material theme
    args[arg] = 'mat'
    await runCommand('serve:quasar', {}, args)
    expect(process.env.QUASAR_THEME).toBe('mat')

    // Ios theme
    args[arg] = 'ios'
    await runCommand('serve:quasar', {}, args)
    expect(process.env.QUASAR_THEME).toBe('ios')
  })

  test.each([{ p: platform }, { platform }])(
    'Uses platform set in args',
    async args => {
      const serveCommands = {
        web: 'serve',
        electron: 'electron:serve',
        capacitor: 'capacitor:serve'
      }
      await runCommand('serve:quasar', {}, args)
      expect(serviceRun).toBeCalledWith(serveCommands[platform], { _: [] }, [])
    }
  )

  if (platform === 'web') {
    test('Default platform is web', async () => {
      await runCommand('serve:quasar', {}, {})
      expect(serviceRun).toBeCalledWith('serve', { _: [] }, [])
    })
  }
})
