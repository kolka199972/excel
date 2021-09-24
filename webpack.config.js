const CopyPlugin = require('copy-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  const filename = (extension) => isProd ? `[name].[contenthash].bundle.${extension}` : `[name].bundle.${extension}`
  const plugins = (plugin) => {
    const pluginsBase = [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          {from: path.resolve(__dirname, 'src', 'favicon.ico'), to: path.resolve(__dirname, 'dist')},
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css')
      }),
    ]

    if (plugin) {
      pluginsBase.push(plugin)
    }
    return pluginsBase
  }

  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        './index.js'
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename('js'),
      clean: true
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', 'core'),
      }
    },
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      watchFiles: './',
    },
    plugins: isDev ? plugins(new ESLintWebpackPlugin()) : plugins(),
    devtool: isDev ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
  }
}
