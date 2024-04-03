module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:@env",
        {
          moduleName: "react-native-dotenv",
          path: ".env",
        },
      ],
    ],
  };
};
