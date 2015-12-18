module.exports = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'riot-redux.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    redux: {commonjs2: 'redux'}
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {root: __dirname}
};
