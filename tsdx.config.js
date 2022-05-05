const css = require('rollup-plugin-import-css');

module.exports = {
  rollup (config, opts) {
    if (opts.environment === 'development') {
       // redirect dev build to nowhere
       config.output.file = ''
    } else {
      // rename prod build to index.js
      config.output.file = './dist/index.js'
      // config.output.format = 'esm'
    }
    config.plugins = [...config.plugins, css()]
    return config
  }
}
