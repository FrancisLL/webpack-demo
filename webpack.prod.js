'use strict'

const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')

// const { wrap } = new SpeedMeasureWebpackPlugin()

const autoprefixer = require('autoprefixer');

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  console.log(entryFiles)
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]

      const match = entryFile.match(/src\/(.*)\/index\.js/)
      const pageName = match && match[1]
      entry[pageName] = entryFile

      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['commons', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minify: true,
            removeComments: false
          }
        })
      )
      console.log('pageName', pageName)
    })
  return {
    entry,
    htmlWebpackPlugins
  }
}
const { entry, htmlWebpackPlugins } = setMPA()

const config = {
  mode: 'production',
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          // 'postcss-loader'
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    autoprefixer({
                      overrideBrowserslist: [
                        'last 10 Chrome versions',
                        'last 5 Firefox versions',
                        'Safari >= 6', 
                        'ie> 8'
                      ] 
                    })
                  ]
                ]
              }
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:9].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: '[name]_[contenthash:8].css'
    // }),
    new CleanWebpackPlugin(),
    // 使用 htmlwbpackexternalsplugin 分离公共包 
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
    //       global: 'ReactDom'
    //     }
    //   ]
    // })
  ].concat(htmlWebpackPlugins),
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
}

// SpeedMeasureWebpackPlugin 与 MiniCssExtractPlugin 不兼容处理
const configWithTimeMeasures = new SpeedMeasureWebpackPlugin().wrap(config);
configWithTimeMeasures.plugins.push(new MiniCssExtractPlugin({
  filename: '[name]_[contenthash:8].css'
}));
// SpeedMeasureWebpackPlugin 与 MiniCssExtractPlugin 不兼容处理

module.exports = configWithTimeMeasures