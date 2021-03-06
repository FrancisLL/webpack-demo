'use strict'

const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const PATHS = { src: path.join(__dirname, 'src') }

// const { wrap } = new SpeedMeasureWebpackPlugin()

const autoprefixer = require('autoprefixer');
const webpack = require('webpack')

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
        include: path.resolve('src'),
        exclude: /node_modules/,
        use: [
          'cache-loader',
          'thread-loader',
          'babel-loader'
        ]
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
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
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
    // ??????????????????
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    // ?????? htmlwbpackexternalsplugin ??????????????? 
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
    // new webpack.DllReferencePlugin({
    //   context: path.join(__dirname, 'build/library'),
    //   manifest: require('./build/library/library.json')
    // }),
    // new HardSourceWebpackPlugin()
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true})
    })
  ].concat(htmlWebpackPlugins),
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      // new TerserPlugin({
      // 	parallel: true
      // })
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
  },
  resolve: {
    // alias: {
    //   'react': path.resolve(__dirname, '/node_modules/umd/react/react.production.min.js'),
    //   'react-dom': path.resolve(__dirname, '/node_modules/umd/react-dom/react-dom.production.min.js')
    // },
    // extensions: ['.js'],
    // mainFields: ['mian']
  }
}

// SpeedMeasureWebpackPlugin ??? MiniCssExtractPlugin ???????????????
const configWithTimeMeasures = new SpeedMeasureWebpackPlugin().wrap(config);
configWithTimeMeasures.plugins.push(new MiniCssExtractPlugin({
  filename: '[name]_[contenthash:8].css'
}));
// SpeedMeasureWebpackPlugin ??? MiniCssExtractPlugin ???????????????

module.exports = configWithTimeMeasures