const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
    entry: {
        vendor: './src/vendor',
        index: './src/main.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        publicPath: publicPath
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './src/assets/favicon.ico'),
            template: 'src/index.html'
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, './static'),
                to: 'static'
            }
        ])
    ],
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src'),
            '@': resolve(__dirname, 'src')
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8010,
        proxy: {
            '/api/': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true
            }
        },
        historyApiFallback: {
            index: publicPath
        }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
})