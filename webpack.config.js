const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: "production",
  devtool: 'source-map',
  context: __dirname,
  entry: {
    "ComplexZmanimCalendar": "./src/ComplexZmanimCalendar.ts",
    "ComplexZmanimCalendar.min": "./src/ComplexZmanimCalendar.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    libraryTarget: "umd",
    library: "KosherZmanim",
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              logInfoToStdOut: true,
              compilerOptions: {
                target: "es5",
                module: "es6",
              },
              configFile: "src/tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      include: /\.min\.js$/,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
      },
    })],
  },
};

