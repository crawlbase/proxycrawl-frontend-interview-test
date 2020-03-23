const path = require('path');
const webpack = require('webpack');
const jsPath = path.resolve(__dirname, '../public/assets/js');

const config = {
  mode: 'development',
  entry: {
    main: './public/assets/js/webpack-entry-module.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: jsPath,
    publicPath: '/assets/'
  },
  resolve: {
    modules: [
      'node_modules',
      jsPath
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [ jsPath ],
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/preset-env', {
                  'targets': {
                    'browsers': ['last 2 versions', 'safari >= 7']
                  }
                }
              ]
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};

module.exports = config;
