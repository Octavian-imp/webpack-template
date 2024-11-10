const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const Dotenv = require("dotenv-webpack")

module.exports = (env) => {
  const isDev = env.MODE === "development" || env.MODE === "dev"
  const PORT = env.PORT || 3000
  const MODE_DEV = isDev ?? "development"

  /**
   * Returns babel options with provided presets. If no presets are provided,
   * defaults to @babel/preset-env.
   *
   * @param {...string} preset - Presets to be used by babel
   * @return {object} - Babel options
   */
  function getBabelOpts(...preset) {
    const opts = {
      presets: ["@babel/preset-env"],
    }

    if (preset.length > 0) {
      opts.presets.push(...preset)
    }

    return opts
  }

  /**
   * Returns optimization options for webpack. If isDev is true, it disables
   * minimization. Otherwise, it uses TerserWebpackPlugin for minification.
   *
   * @return {object} - Optimization options
   */
  function getOptimization() {
    const config = {
      splitChunks: {
        chunks: "all",
      },
    }

    if (!isDev) {
      config.minimizer = [new TerserWebpackPlugin()]
    }
    return config
  }

  /**
   * Returns an array of style loaders for webpack, given the presets.
   * If "tailwind" is in the presets, it adds support for tailwindcss.
   * If "scss" is in the presets, it adds support for scss/sass files.
   * If "css-modules" is in the presets, it adds support for css-modules.
   *
   * @param {...string} preset - presets to add support for
   * @return {array} - array of style loaders
   */
  function getStyleLoaders(...preset) {
    const config = [isDev ? "style-loader" : MiniCssExtractPlugin.loader]
    if (preset.findIndex((ext) => ext === "css-modules") !== -1) {
      config.push({
        loader: "css-loader",
        options: {
          modules: {
            auto: /\.module\.\w+/i,
            namedExport: false,
            exportLocalsConvention: "as-is",
            localIdentName: "[folder]__[local]___[hash:base64:5]",
          },
        },
      })
    } else {
      config.push("css-loader")
    }
    if (preset.findIndex((ext) => ext === "tailwind") !== -1) {
      // adding postcss for supporting tailwind
      config.push("postcss-loader")
    }
    if (preset.findIndex((ext) => ext === "scss") !== -1) {
      config.push("sass-loader")
    }
    return config
  }

  /**
   * Returns module rules for webpack configuration.
   *
   * @param {...string} addSupportFiles - Extensions to add support for. Supports
   * "tailwind", "scss", "css-modules", "xml", "csv", "ts", and "react".
   * @returns {object} - Module rules for webpack configuration.
   */
  function getModuleRules(...addSupportFiles) {
    const stylesPreset = []
    if (addSupportFiles.findIndex((ext) => ext === "tailwind") !== -1) {
      stylesPreset.push("tailwind")
    }
    if (addSupportFiles.findIndex((ext) => ext === "css-modules") !== -1) {
      stylesPreset.push("css-modules")
    }
    const config = {
      rules: [
        {
          test: /\.css$/,
          use: getStyleLoaders(...stylesPreset),
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext]",
          },
        },
        {
          test: /\.(ttf|woff|eot|woff2)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: getBabelOpts(),
            },
          ],
        },
      ],
    }

    if (addSupportFiles.findIndex((ext) => ext === "scss") !== -1) {
      config.rules.push({
        test: /\.s[ac]ss$/,
        use: getStyleLoaders(...stylesPreset, "scss"),
      })
    }

    if (addSupportFiles.findIndex((ext) => ext === "xml") !== -1) {
      config.rules.push({
        test: /\.xml$/,
        use: ["xml-loader"],
      })
    }

    if (addSupportFiles.findIndex((ext) => ext === "csv") !== -1) {
      config.rules.push({
        test: /\.csv$/,
        use: ["csv-loader"],
      })
    }

    if (addSupportFiles.findIndex((ext) => ext === "ts") !== -1) {
      config.rules.push({
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: getBabelOpts("@babel/preset-typescript"),
          },
        ],
      })
    }
    if (addSupportFiles.findIndex((ext) => ext === "react") !== -1) {
      const loaderOptions = ["@babel/preset-react"]

      if (addSupportFiles.findIndex((ext) => ext === "ts") !== -1) {
        loaderOptions.push("@babel/preset-typescript")
      }

      config.rules.push({
        test: /\.[jt]sx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: getBabelOpts(...loaderOptions),
          },
        ],
      })
    }

    return config
  }

  const mainConfigOptions = {
    context: path.resolve(__dirname, "src"),
    entry: {
      main: ["@babel/polyfill", "./index.js"],
    },
    mode: MODE_DEV ? "development" : "production",
    output: {
      filename: "[name].[hash].js",
      path: __dirname + "/dist",
    },
    resolve: {
      extensions: [".js", ".scss", ".css"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: PORT,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
      client: {
        progress: true,
      },
    },
    optimization: getOptimization(),
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        minify: {
          collapseWhitespace: isDev ? false : true,
          removeComments: isDev ? false : true,
        },
      }),
      new CleanWebpackPlugin(),
      // раскомментировать при первом запуске со статикой
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       // for static files
      //       from: path.resolve(__dirname, "src/assets"),
      //       to: path.resolve(__dirname, "dist/assets"),
      //     },
      //   ],
      // }),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
      }),
      new Dotenv(),
    ],
    module: getModuleRules("scss"),
  }

  return [
    {
      ...mainConfigOptions,
      name: "html-scss-js",
      entry: {
        main: ["@babel/polyfill", "./index.js"],
      },
    },
    {
      ...mainConfigOptions,
      name: "html-scss-js-tailwind",
      entry: {
        main: ["@babel/polyfill", "./index.js"],
      },
      module: getModuleRules("scss", "tailwind"),
    },
    {
      ...mainConfigOptions,
      name: "react-ts-scss-cssModules",
      entry: {
        main: ["@babel/polyfill", "./index.tsx"],
      },
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      module: getModuleRules("scss", "react", "ts", "css-modules"),
    },
    {
      ...mainConfigOptions,
      name: "react-ts-scss-cssModules-tailwind",
      entry: {
        main: ["@babel/polyfill", "./index.tsx"],
      },
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      module: getModuleRules("scss", "react", "ts", "css-modules", "tailwind"),
    },
  ]
}
