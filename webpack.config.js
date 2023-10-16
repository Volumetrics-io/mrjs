const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: '',
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window',
  },

  optimization: {
    minimize: true,
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
