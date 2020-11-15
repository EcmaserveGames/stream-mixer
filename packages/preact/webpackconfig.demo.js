const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: './temp',
    hot: true,
  },
  entry: './demo/index.tsx',
  output: {
    path: path.resolve(__dirname, 'temp'),
    filename: 'demo.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@ecmaservegames/stream-mixer-core': path.resolve(
        __dirname,
        '../core/lib'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './demo/index.html' })],
}
