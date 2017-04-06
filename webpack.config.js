'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const path = require('path');

module.exports = {
    context: path.join(__dirname, "src"),
    entry: ['./index'],
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        publicPath: ''
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread'],
                }
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin(`css/[name].css`),
        new HtmlWebpackPlugin({
            template: `${__dirname}/src/index.html`,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]

}
