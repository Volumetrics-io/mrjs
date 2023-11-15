import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
    entry: './src/index.js',
    output: {
        publicPath: 'auto',
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
        extensions: ['.mjs', '.js'],
        alias: {
            MRJS: path.resolve(__dirname, 'src/utils/global'), // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        },
        fallback: {
            fs: false,
            path: false,
        },
        fullySpecified: false, // disable required .js / .mjs when importing
    },

    mode: process.env.NODE_ENV || 'development',

    plugins: [
        // ...

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
                test: /\.wasm$/,
                type: 'webassembly/async', // or 'webassembly/sync'
            },
        ],
    },
}
