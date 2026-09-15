module.exports = (api) => {
  api.cache(true);
  const plugins = [];
  if (process.env.NODE_ENV !== "test") {
    plugins.push(["react-native-unistyles/plugin", { root: "src" }]);
  }
  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
