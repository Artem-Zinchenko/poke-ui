'use strict';
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    context: path.join(__dirname, "src"),
    entry: ['./index'],
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        publicPath: ''
    },
    module: {},
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/src/index.html`,
            hash: true
        }),]
}
