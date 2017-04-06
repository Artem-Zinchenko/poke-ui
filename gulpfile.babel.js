'use strict';

import gulp from "gulp";
import gutil from "gulp-util";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfig from "./webpack.config.js";
import mockServer from "raml-mocker-server";

// The development server by default
gulp.task("default", ["mock-server", "webpack-dev-server"]);

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", (callback) => {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, (err, stats) => {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

//what we are going to proxy
const proxy = url => ({
    '/api/*': {
        target: url,
        secure: false
    }
});

gulp.task('mock-server', () => {
    mockServer({
        // path to raml folder, relative to the execution context
        path: 'raml',
        debug: true,
        watch: true,
        port: 8081,
        prefix: ['']
    });
});

const PROXY = {
    dev: proxy('http://path-to-dev'),
    prod: proxy('http://path-to-prod'),
    default: proxy(`http://localhost:8081`)
};

gulp.task("webpack-dev-server", (callback) => {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "cheap-module-eval-source-map";

    // Start a webpack-dev-server
    const proxy = PROXY['default'];
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        historyApiFallback: true,
        // proxy,
        hot: true,
        inline: true,
        // progress: true,
        stats: {
            colors: true,
            chunks: false, // Makes the build much quieter
        }
    }).listen(8080, "localhost", (err) => {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/");
    });
});