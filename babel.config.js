module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
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
