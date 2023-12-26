const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  // github pages
  outputDir: "./docs",
  assetsDir: ".",
  publicPath: ".",

  // webpack
  configureWebpack: {
    devServer: {
      historyApiFallback: {
        rewrites: [{ from: /\*/, to: "/index.html" }],
      },
    },
  },
});
