exports.getJsxRule = () => ({
  test: /\.jsx?$/,
  loader: 'babel-loader',
  options: {
    babelrc: false,
    configFile: './.babelrc.js'
  }
})