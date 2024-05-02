import CopyPlugin from 'copy-webpack-plugin';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine the environment (e.g., testing or development)
const isTesting = process.env.NODE_ENV === 'development';

export default {
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: 'mr.js',
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
            mrjs: path.resolve(__dirname, './src'), // <-- When you build or restart dev-server, you'll get an error if the path to your global.js file is incorrect.
            mrjsUtils: path.resolve(__dirname, './src/utils'),
        },
        fallback: {
            fs: false,
            path: false,
        },
        fullySpecified: false, // disable required .js / .mjs extensions when importing
    },

    mode: process.env.NODE_ENV || 'development',

    plugins: [
        new CopyPlugin({
            patterns: [
                // make these items generate in dist as default for the runner: index.html, style.css, and assets folder
                { from: 'samples/index-assets', to: 'index-assets' },
                { from: 'samples/index.html', to: 'index.html' },
                { from: 'samples/index-style.css', to: 'index-style.css' },
                { from: 'samples/examples', to: 'examples' },
                { from: 'samples/examples-assets', to: 'examples-assets' },
            ],
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
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.json$/,
                use: 'json-loader',
            },
        ],
    },
};
