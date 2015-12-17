module.exports = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'riot-redux.js',
    libraryTarget: 'umd',
    library: 'RiotRedux'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {root: __dirname}
};
