const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Set output to auto
      webpackConfig.output.publicPath = "auto";

      // Add Module Federation Plugin
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "task",
          filename: "remoteEntry.js",
          exposes: {
            "./TaskModule": "./src/modules/TaskModule",
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: deps.react,
              eager: true,
            },
            "react-dom": {
              singleton: true,
              requiredVersion: deps["react-dom"],
              eager: true,
            },
            "react-router-dom": {
              singleton: true,
              requiredVersion: deps["react-router-dom"],
              eager: true,
            },
          },
        }),
      );

      return webpackConfig;
    },
  },
};
