import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: {
    main: './src/index.js',
    // sample0: './samples/sample.js',
  },
  output: {
    filename: '[name].bundle.js',
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
    extensions: ['.mjs', '.js'],
    alias: {
      MRJS: path.resolve(__dirname, 'src/utils/global'), // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
    },
    fallback: {
      fs: false,
      path: false,
    },
    fullySpecified: false, // disable required .js / .mjs extensions when importing
  },

  mode: process.env.NODE_ENV || 'development',

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // Output filename for the HTML file that will be generated in dist
      template: './samples/index.html', // Path to your HTML file (that you can modify)
      //chunks: ['sample1'], // Specify the chunks to include in this HTML file
      // Add other configurations as needed...
    }),
    new CopyPlugin({
        patterns: [
            { from: 'assets', to: 'assets' }, // make the MR.js/assets folder generate in the dist
            { from: 'samples', to: 'samples' }, // make the MR.js/samples folder generate in the dist
        ],
    }),
    new webpack.ProvidePlugin({
      MRJS: 'MRJS',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css/,
        type: 'text/css',
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async', // or 'webassembly/sync'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
