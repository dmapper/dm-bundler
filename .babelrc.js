const genericNames = require('generic-names')
const {LOCAL_IDENT_NAME} = require('./buildOptions')

const DIRECTORY_ALIASES = {
  components: './components',
  helpers: './helpers',
  clientHelpers: './clientHelpers',
  model: './model',
  main: './main',
  styles: './styles',
  appConstants: './appConstants'
}

const basePresets = ['react-native']
const basePlugins = [
  ['@babel/plugin-proposal-decorators', {legacy: true}],
  ['module-resolver', { alias: DIRECTORY_ALIASES }]
]

const dotenvPlugin = ({production} = {}) =>
  ['dotenv-import', {
    moduleName: '@env',
    path: ['.env', production ? '.env.production' : '.env.local'],
    safe: true,
    allowUndefined: true
  }]

const webReactCssModulesPlugin = ({production} = {}) =>
  ['react-css-modules', {
    handleMissingStyleName: 'ignore',
    filetypes: {
      '.styl': {}
    },
    generateScopedName,
    webpackHotModuleReloading: !production
  }]

const nativeBasePlugins = () => [
  ['react-native-stylename-to-style', {
    extensions: ['styl', 'css']
  }],
  [
    'react-native-platform-specific-extensions',
    {
      extensions: ['styl', 'css']
    }
  ]
]

module.exports = {
  presets: basePresets,
  plugins: basePlugins,
  env: {
    development: {
      plugins: [].concat(
        [dotenvPlugin()],
        nativeBasePlugins()
      )
    },
    production: {
      plugins: [].concat(
        [dotenvPlugin({production: true})],
        nativeBasePlugins()
      )
    },
    web_development: {
      plugins: [
        'react-hot-loader/babel',
        dotenvPlugin(),
        webReactCssModulesPlugin()
      ]
    },
    web_production: {
      plugins: [
        dotenvPlugin({production: true}),
        webReactCssModulesPlugin({production: true})
      ]
    },
    server: {
      plugins: [
        ['@babel/plugin-transform-runtime', {
          regenerator: true
        }]
      ]
    }
  }
}

function generateScopedName (name, filename/* , css */) {
  let hashSize = LOCAL_IDENT_NAME.match(/base64:(\d+)]/)
  if (!hashSize) {
    throw new Error(
      'wrong LOCAL_IDENT_NAME. Change generateScopeName() accordingly'
    )
  }
  hashSize = Number(hashSize[1])
  if (new RegExp(`_.{${hashSize}}_$`).test(name)) return name
  return genericNames(LOCAL_IDENT_NAME)(name, filename)
}
