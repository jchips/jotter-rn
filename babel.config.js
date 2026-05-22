module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['@babel/plugin-proposal-optional-chaining-assign',
        {
          "version": "2023-07"
        }]
    ],
  };
};