import { Configuration } from 'webpack'
import { Configuration as DevServer } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as path from 'path'

type WebpackConfig = Configuration & { devServer: DevServer }

const publicPath = process.env.publicPath || '/'
const appTitle = process.env.appTitle || 'React App'

const isProduction = process.env.NODE_ENV === 'production'

const commonCSSLoaders = [
  isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        plugins: [require('postcss-preset-env')],
      },
    },
  },
]

const entryMain = [
  !isProduction && 'react-hot-loader/patch',
  './src/index.tsx',
].filter(Boolean) as string[]

const plugins = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    title: appTitle,
    minify: {
      removeComments: isProduction,
      collapseWhitespace: isProduction,
    },
    favicon: './public/favicon.ico',
  }),
  isProduction &&
    new MiniCssExtractPlugin({ filename: 'css/main.[contenthash:10].css' }),
].filter(Boolean) as WebpackConfig['plugins']

const config: WebpackConfig = {
  entry: {
    main: entryMain,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[fullhash:10].js',
    publicPath,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: [...commonCSSLoaders],
          },
          {
            test: /\.less$/i,
            use: [...commonCSSLoaders, 'less-loader'],
          },
          {
            test: /\.scss$/i,
            use: [
              ...commonCSSLoaders,
              'sass-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: ['src/css/global.scss'],
                },
              },
            ],
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[contenthash:10].[ext]',
              outputPath: 'imgs',
              publicPath: `${publicPath}/imgs`.replace(/\/\//g, '/'),
            },
          },
          {
            test: /\.(t|j)sx?$/i,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  plugins,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    compress: true,
    hot: true,
    quiet: true,
    contentBase: './public',
    publicPath,
    historyApiFallback: true,
  },
  devtool: !isProduction && 'eval-source-map',
}

export = config
