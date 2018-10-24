const _ = require('lodash')
const webpack = require('webpack')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {LOCAL_IDENT_NAME} = require('./buildOptions')
const {getJsxRule} = require ('./helpers')

const VERBOSE = process.env.VERBOSE
const DEV_PORT = 3010
const PROD = !process.env.WEBPACK_SERVE
const STYLES_PATH = path.join(process.cwd(), '/styles/index.styl')
const BUILD_DIR = '/build/client/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)
const BUNDLE_NAME = 'app'

process.env.BABEL_ENV = PROD ? 'web_production' : 'web_development'

module.exports = _.pickBy({
  mode: PROD ? 'production' : 'development',
  entry: {
    [BUNDLE_NAME]: ['@babel/polyfill', './index.web.js']
  },
  optimization: PROD && {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: BUNDLE_NAME,
          test: /\.(css|styl)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    !VERBOSE && !PROD && new FriendlyErrorsWebpackPlugin(),
    new MomentLocalesPlugin(), // strip all locales except 'en'
    PROD && new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    PROD && new AssetsPlugin({
      filename: 'assets.json',
      fullPath: false,
      path: BUILD_PATH
    })
  ].filter(Boolean),
  output: {
    path: BUILD_PATH,
    publicPath: PROD ? BUILD_DIR : `http://localhost:${DEV_PORT}${BUILD_DIR}`,
    filename: PROD ? '[name].[hash].js' : '[name].js'
  },
  module: {
    rules: [
      Object.assign(getJsxRule(), {
        exclude: /node_modules/,
      }),
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
            publicPath: '/build/client/'
          }
        }
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: LOCAL_IDENT_NAME
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              import: [STYLES_PATH],
              define: {
                __WEB__: true
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: LOCAL_IDENT_NAME
            }
          }
        ]
      },
      // Vendor stylesheets
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          {
            loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // fix warning requiring './locale': https://github.com/moment/moment/issues/1435
      moment$: 'moment/moment.js',
      'react-native': 'react-native-web',
      'react-router-native': 'react-router-dom'
    },
    extensions: ['.web.js', '.js', '.web.jsx', '.jsx', '.json'],
    mainFields: ['jsnext:main', 'browser', 'main']
  }
}, Boolean)
