var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, '');

var config = {
  entry : APP_DIR + '/index.js',
  output : {
    path     : BUILD_DIR,
    filename : 'bundle.js'
  },
  module : {
    loaders : [
      {
        test    : /\.jsx?/,
        include : APP_DIR,
        loader  : 'babel-loader'
      },
      {
        test   : /\.html$/,
        loader : 'html-loader'
      },
      {
        test   : /\.less$/,
        loader : 'style!css!less'
      },
      {
        test : /\.css$/,
        use  : [
          { loader : 'style-loader' },
          { loader : 'css-loader' }
        ]
      }
    ],
  },
  plugins : [
    new HtmlWebpackPlugin({
      title    : 'Namemash',
      template : APP_DIR + '/index.html'
    }),
  ]
}

module.exports = config;
