const path = require('path')

export default {
  hash: true,
  publicPath: '/',
  html: {
    'template': 'src/index.ejs'
  },
  alias: {
    icon: path.join(__dirname, 'src/icon'),
    utils: path.join(__dirname, 'src/utils'),
    i18n: path.join(__dirname, 'src/i18n'),
    assets: path.join(__dirname, 'src/assets'),
    components: path.join(__dirname, 'src/components')
  }
}
