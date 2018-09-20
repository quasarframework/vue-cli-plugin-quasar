const Builder = require('../lib/builder')

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
