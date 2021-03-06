var webpack = require('webpack');
var commonChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var fs = require('fs');

var appPath = path.join(__dirname, 'src');
var modulesPath = path.join(__dirname, 'node_modules');
var tsConfigPath =path.join(__dirname, 'client/tsconfig.json');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

var entryFromConfig = {
    'vendor': path.join(__dirname, 'client', 'vendor.ts'),
    'globals': ['zone.js', 'reflect-metadata'],
}

console.log('Modules: ', config.modules);

for (var app of config.modules) {
  var p = path.join(__dirname, 'client', 'modules', app, app+'.module.ts');
  entryFromConfig[app+'.module'] = path.join(p)
}

module.exports = {

  entry: entryFromConfig,

  resolve: {
    modules: [modulesPath],
    extensions: ['.ts', '.js']
  },

  resolveLoader: {
    modules: [modulesPath]
  },

  externals: {
      "jquery": "jQuery",
      "moment": "moment"
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
            'awesome-typescript-loader?configFileName='+tsConfigPath,
            'angular2-template-loader'
        ]
      },
      {
          test: /\.html$/,
          loader: 'raw-loader'
      },
      {
          test: /\.css$/,
          loader: 'raw-loader'
      }

    //   {
    //     test: /\.html$/,
    //     loader: 'html'
    //   },
    //   {
    //     test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
    //     loader: 'file?name=assets/[name].[hash].[ext]'
    //   },
    //   {
    //     test: /\.css$/,
    //     exclude: helpers.root('src', 'app'),
    //     loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
    //   },
    //   {
    //     test: /\.css$/,
    //     include: helpers.root('src', 'app'),
    //     loader: 'raw'
    //   }
    ]
  },

  plugins: [

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: true }
    // }),

    // new webpack.ContextReplacementPlugin(
    //   // The (\\|\/) piece accounts for path separators in *nix and Windows
    //   /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    //   path.join(__dirname, 'src'), // location of your src
    //   { }
    // ),
    new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve('./src'),
        {}
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'globals']
    }),

    // new HtmlWebpackPlugin({
    //   template: 'src/index.html'
    // })
  ]
};