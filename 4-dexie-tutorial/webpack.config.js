let path = require('path');

module.exports = {
  entry: path.join(__dirname, 'page.js'),
  output: {
    path: __dirname,
  },
  devServer: {
    contentBase: __dirname,
    port: 1123,
  },
}