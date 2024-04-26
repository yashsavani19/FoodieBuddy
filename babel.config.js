module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "REACT_NATIVE_ENV",
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowUndefined: false,
          verbose: false,
        },
      ],
    ],
  };
};
