const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: '',
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    libraryTarget: 'window',
  },

  devServer: {
    https: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
    compress: true,
  },

  optimization: {
    minimize: false,
  },

  experiments: {
    asyncWebAssembly: true,
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      MRJS: path.resolve(__dirname, 'src/utils/global'), // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
    },
    fallback: {
      fs: false,
      path: false,
    },
  },

  plugins: [
    // ...

    new webpack.ProvidePlugin({
      MRJS: 'MRJS',
    }),
  ],
};
