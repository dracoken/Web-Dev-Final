const path = require('path')

module.exports = {
    entry: './public/jsFiles/combatScript.js',
    output: {
      filename: 'combatBundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }