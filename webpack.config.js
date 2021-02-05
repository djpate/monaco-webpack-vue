const { VueLoaderPlugin } = require("vue-loader");
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const relPath = (...args) => path.resolve(__dirname, ...args);
const rootPath = (...args) => relPath(...args);
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    main: "./main.ts",
  },
  context: rootPath('src'),
  output: {
    path: rootPath('dist'),
    filename: '[name].js',
    globalObject: 'self',
  },
  stats: {
    errors: true,
    errorDetails: true
  },
  devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
        include: /node_modules/,
        exclude: /\.(ts|d\.ts|d\.ts\.map)$/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        use: ['file-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
    new MonacoWebpackPlugin({
      languages: ['json'],
    }),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.esm.js",
    },
    extensions: ["*", ".js", ".vue", ".json", ".ts", "*.mjs"],
  },
  devServer: {
    historyApiFallback: true,
  },
};