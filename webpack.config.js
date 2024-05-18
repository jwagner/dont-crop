const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = (env) => {
  const { production } = env;
  const mode = production ? 'production' : 'development';
  const dev = !production;
  const homepage = production ? new URL(pkg.homepage).pathname : '/';
  return {
    mode,
    devtool: dev && 'eval-source-map',
    devServer: {
      static: path.join(__dirname, 'examples/testsuite/'),
      host: '0.0.0.0',
      headers: {
        // this works around getting net::ERR_CONTENT_LENGTH_MISMATCH 200 (OK)
        // with webpack running inside a vs code dev container.
        // Poking at things in the dark here but I presume it's
        // related to keep alives. :)
        // connection: 'close',
      },
    },
    entry: {
      testsuite: './examples/testsuite/index.ts',
      react: './examples/react/index.tsx',
    },
    // optimization: {
    //   mangleExports: 'size',
    //   moduleIds: 'size',
    // },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'static/[name]-[contenthash].js',
      assetModuleFilename: 'static/[name]-[hash][ext][query]',
      publicPath: homepage,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Dont-crop Test Suite',
        chunks: ['testsuite'],
        template: 'examples/testsuite/index.html',
        filename: 'index.html',
        inject: false,
      }),
      new HtmlWebpackPlugin({
        title: 'Dont-Crop Test Suite',
        chunks: ['react'],
        filename: 'react.html',
      }),
      production && new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ].filter((x) => !!x),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { configFile: 'tsconfig.json' },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          sideEffects: true,
        },
        {
          test: /\.(jpg|png)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};
