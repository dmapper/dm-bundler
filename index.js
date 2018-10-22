const { getJsxRule } = require('./helpers')

exports.babelrc = require('./.babelrc')
exports.webpackServerConfig = require('./webpack.server')
exports.webpackWebConfig = require('./webpack.web')
exports.getJsxRule = getJsxRule
