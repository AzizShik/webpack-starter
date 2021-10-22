const path = require('path');
const webpack = require('webpack');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require("imagemin-webpack");

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },

  mode: 'development',
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  module: {
    rules: [{
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.(?:ico|gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }, 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new webpack.HotModuleReplacementPlugin(),

    new CopyPlugin({
      patterns: [{
        from: '**/*',
        context: path.resolve(__dirname, 'src'),
        globOptions: {
          ignore: [
            '**/*.js',
            '**/*.ts',
            '**/*.scss',
            '**/*.sass',
            '**/*.html',
          ],
        },
        noErrorOnMissing: true,
        force: true,
      }],
    }),


    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", {
            interlaced: true
          }],
          ["jpegtran", {
            progressive: true
          }],
          ["optipng", {
            optimizationLevel: 5
          }],
          [
            "svgo",
            {
              plugins: [{
                removeViewBox: false
              }]
            }
          ]
        ],
      }
    }),



    new CleanWebpackPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[contenthash].js',
  }
};