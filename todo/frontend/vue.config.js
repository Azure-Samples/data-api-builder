const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/graphql': {
        target: 'https://localhost:5001/',
        changeOrigin: true,
      },
    },
  }
})
