const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window',
  },

  optimization: {
    minimize: false,
  },

  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
}
