const Builder = require('../lib/builder')
const chalk = require('chalk')

describe('constructor', () => {
  test('sets args', () => {
    const builder = new Builder('expected')
    expect(builder.args).toBe('expected')
  })

  test('Adds web target with mat theme by default', () => {
    const builder = new Builder()
    expect(builder.targets).toEqual([
      { platform: 'web', theme: 'mat', args: {} }
    ])
  })

  test.each(['web', 'electron', 'cordova'])(
    'Adds %s to targets if arg is passed',
    target => {
      const args = {}
      args[target] = 'expected'
      const builder = new Builder(args)
      expect(builder.targets).toEqual([
        { theme: 'mat', platform: target, args: {} }
      ])
    }
  )

  test.each([['mat'], ['ios'], ['mat', 'ios']])(
    'Uses theme passed in args',
    (...themes) => {
      const args = {}
      const expectedResult = []
      themes.forEach(theme => {
        args[theme] = true
        expectedResult.push({ theme, platform: 'web', args: {} })
      })
      const { targets } = new Builder(args)
      expect(targets).toEqual(expectedResult)
    }
  )

  test.skip('Mixes theme args with general args', () => {
    const { targets } = new Builder({
      mat: '--web false --electron "--expected"',
      web: true,
      electron: 'wrong',
      cordova: true
    })
    expect(targets).toEqual([
      { theme: 'mat', platform: 'electron', args: { electron: true } },
      { theme: 'mat', platform: 'cordova', args: {} }
    ])
  })

  test('Uses config from pluginOptions', () => {
    const { targets } = new Builder(
      { config: 'example' },
      {
        configurations: {
          example: {
            electron: { someArg: 'expected' },
            web: true,
            ios: {
              // Should overwrite other config
              web: false
            }
          }
        }
      }
    )
    expect(targets).toEqual([
      { theme: 'ios', platform: 'electron', args: { someArg: 'expected' } }
    ])
  })
})

const mockApi = {
  service: { run: jest.fn() },
  hasPlugin: jest.fn(() => true)
}
console.log = jest.fn()

describe('buildWeb', () => {
  test.each(['mat', 'ios'])('Builds for each theme', theme => {
    const config = {}
    config[theme] = { web: { someArg: 'expected' } }
    const builder = new Builder(
      { config: 'default' },
      { configurations: { default: config } },
      mockApi
    )
    builder.buildWeb()
    expect(process.env.QUASAR_THEME).toBe(theme)
    expect(mockApi.service.run).toBeCalledWith('build', {
      someArg: 'expected',
      dest: `dist/web-${theme}`
    })
  })
})

describe('buildElectron', () => {
  test('Throws error if vcp-electron-builder is not installed', () => {
    const builder = new Builder(
      { config: 'default' },
      { configurations: { default: { electron: true } } },
      mockApi
    )
    mockApi.hasPlugin.mockImplementationOnce(() => false)
    return builder.buildElectron().catch(e => {
      expect(e).toEqual(
        new Error(
          `To build for Electron, Vue CLI Plugin Electron Builder is required. Install it with ${chalk.bold(
            'vue add electron-builder'
          )}.`
        )
      )
    })
  })

  test.each(['mat', 'ios'])('Builds for each theme', theme => {
    const config = {}
    config[theme] = { electron: { someArg: 'expected' } }
    const builder = new Builder(
      { config: 'default' },
      { configurations: { default: config } },
      mockApi
    )
    builder.buildElectron()
    expect(process.env.QUASAR_THEME).toBe(theme)
    expect(mockApi.service.run).toBeCalledWith(
      'electron:build',
      {
        someArg: 'expected',
        dest: `dist/electron-${theme}`
      },
      // Passes raw args
      ['First arg is removed', '--someArg', 'expected']
    )
  })
})

test('buildAll', async () => {
  const builder = new Builder()
  builder.buildElectron = jest.fn()
  builder.buildWeb = jest.fn()
  await builder.buildAll()
  // Both platforms are built for
  expect(builder.buildElectron).toBeCalled()
  expect(builder.buildWeb).toBeCalled()
})
