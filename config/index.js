let path = require('path')
let proxyIPs = {
  WANLI: 'http://192.168.1.121:1234/', // 万里小哥哥
  HONGDENG: 'http://192.168.5.241:1234/' // 水滴灯小哥哥
}
module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: proxyIPs.WANLI,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    host: 'localhost',
    port: 9528,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false,
    devtool: 'eval-source-map',
    cacheBusting: true,
    cssSourceMap: false,
    useEslint: false,
    showEslintErrorsInOverlay: false
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}