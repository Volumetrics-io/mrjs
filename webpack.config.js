const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: '',
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    libraryTarget: 'window',
  },

  optimization: {
    minimize: false,
  },

  experiments: {
    asyncWebAssembly: true,
  },

  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
}
