module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-worklets/plugin', // Reanimated 4 — DOIT être la DERNIÈRE ligne
    ],
  };
};