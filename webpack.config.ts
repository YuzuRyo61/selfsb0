// @ts-ignore
import path from "path";

import { Configuration } from 'webpack';

// @ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import HtmlWebpackPlugin from 'html-webpack-plugin';

const isDev = process.env.NODE_ENV === 'development';

const configCommon: Configuration = {
  mode: isDev ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.svelte'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {loader: 'ts-loader'},
          {loader: 'ifdef-loader', options: { DEBUG: isDev }},
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            }
          },
        ],
      },
      {
        test: /\.(ico|png|jpe?g|svg|eot|woff?2?)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(html|svelte)$/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: require('svelte-preprocess')(),
            hotReload: true,
          }
        }
      }
    ]
  },
  watch: isDev,
  performance: { hints: false },
  devtool: isDev ? 'inline-source-map' : undefined,
}

const mainProcess: Configuration = {
  ...configCommon,
  target: 'electron-main',
  entry: {
    main: './src/main.ts',
  }
}

const preloadProcess: Configuration = {
  ...configCommon,
  target: 'electron-preload',
  entry: {
    preload: './src/preload.ts',
  }
}

const renderer: Configuration = {
  ...configCommon,
  target: 'web',
  entry: {
    renderer: './src/renderer/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'renderer'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      minify: !isDev,
      inject: 'body',
      filename: 'index.html',
      title: 'selfsb0',
    }),
  ]
}

const config = isDev ? [renderer] : [mainProcess, preloadProcess, renderer];
// noinspection JSUnusedGlobalSymbols
export default config;
