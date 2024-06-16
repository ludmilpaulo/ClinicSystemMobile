module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Remove the following line:
    // plugins: ["react-native-reanimated/plugin"]
  };
};
