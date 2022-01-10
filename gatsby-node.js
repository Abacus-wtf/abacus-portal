// eslint-disable-next-line import/no-extraneous-dependencies
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require("webpack")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        process: "process",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
      },
    },
  })
}
