module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      targets: {
        node: 'current',
      },
      plugins: [],
    },
  },
}
