const { getJsxRule } = require('./helpers')

exports.babelConfig = require('./babel.config.js')
exports.webpackServerConfig = require('./webpack.server')
exports.webpackWebConfig = require('./webpack.web')
exports.getJsxRule = getJsxRule
