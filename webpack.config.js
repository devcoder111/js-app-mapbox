const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let appConfig = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/app.js'),
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'app.bundle.js',
        publicPath: '/dist/'
    },
    watchOptions: {
        ignored: ['node_modules', 'app/**/*/.js']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            },
            {
                test    : /\.(png|gif|jpg|svg)$/i,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            },
            
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new VueLoaderPlugin()
    ],
    devServer: {
        port: 80,
        host: '0.0.0.0',
        proxy: {
            '/wp-json': {
                target: 'https://www.sterlingedmonton.com/',
                secure: false,
                changeOrigin: true
            }
        },
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/' }
            ]
        }
    }
};

let listingConfig = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/listing.js'),
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'listing.bundle.js',
        publicPath: '/dist/'
    },
    watchOptions: {
        ignored: ['node_modules', 'app/**/*/.js']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            },
            {
                test    : /\.(png|gif|jpg|svg)$/i,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new VueLoaderPlugin()
    ],
    devServer: {
        bonjour: true,
        proxy: {
            '/wp-json': {
                target: 'https://www.sterlingedmonton.com/',
                secure: false,
                changeOrigin: true
            }
        },
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/' }
            ]
        }
    }
};

let modelsConfig = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/models.js'),
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'models.bundle.js',
        publicPath: '/dist/'
    },
    watchOptions: {
        ignored: ['node_modules', 'app/**/*/.js']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            },
            {
                test    : /\.(png|gif|jpg|svg)$/i,
                exclude : /(node_modules)/,
                use     : 'file-loader',
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new VueLoaderPlugin()
    ],
    devServer: {
        proxy: {
            '/wp-json': {
                target: 'https://www.sterlingedmonton.com/',
                secure: false,
                changeOrigin: true
            }
        },
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/' }
            ]
        }
    }
};

module.exports = [
    appConfig,
    listingConfig,
    modelsConfig
];