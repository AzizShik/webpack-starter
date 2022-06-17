const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');

let conf = {
  entry: {main: path.resolve(__dirname, './src/js/main.js')},

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `./img/[name].[contenthash].[ext]}`,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `./fonts/[name].[contenthash].[ext]}`,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  optimization: {
    minimizer: [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css',
    }),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: true,
      favicon: 'src/assets/favicon.ico',
    }),

    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        plugins: [
          ['gifsicle', {interlaced: true}],
          ['jpegtran', {progressive: true}],
          ['optipng', {optimizationLevel: 5}],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
      ],
    }),
  ],

  devServer: {
    static: './dist/',
    watchFiles: ['src/*.html', 'src/scss/*'],
    port: 3000,
    open: true,
    compress: true,
    hot: true,
    liveReload: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  output: {
    filename: `[name].[contenthash].js`,
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },
};

module.exports = (env, argv) => {
  let isProd = argv.mode === 'production';
  conf.devtool = isProd ? false : 'eval-cheap-module-source-map';

  return conf;
};
