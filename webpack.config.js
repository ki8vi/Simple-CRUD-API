const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (mode) => {
  const entryName = mode.NODE_ENV === 'startCluster' ? 'startCluster.ts' : 'index.ts';
  return {
    target: 'node',
    mode: 'production',
    entry: `./src/${entryName}`,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ]
    }
  }
};