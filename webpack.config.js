const path = require('path')

const CheckES5WebpackPlugin = require('check-es5-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = (env) => {
  return {
    mode: 'production',
    entry: './src/index.ts',
    stats: {
      preset: 'errors-warnings',
      timings: true,
    },
    // Max /dist/index.js size is 50 kB
    performance: {
      hints: 'error',
      maxEntrypointSize: 50 * 1024,
    },
    module: {
      // Transpile TS to JS
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    // Output is in /dist/index.js
    output: {
      filename: 'index.js',
      globalObject: 'this',
      library: 'library',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      // Speeds up checking of typescript
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          build: true,
          mode: 'write-dts',
        },
      }),
      // Check that output is really ES5
      new CheckES5WebpackPlugin(),
    ],
    // Output is ES5 (not ES6)
    target: ['web', 'es5'],
    /**
     * All dependencies from package.json dependencies should be listed here to exclude
     * them from the build
     */
    externals: {},
  }
}
