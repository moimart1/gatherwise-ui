// NOTE this file is used by automated tests

// without transform, importing svg, etc. will break tests
// see https://jestjs.io/docs/code-transformation#examples

const path = require('path')

module.exports = {
  process(src, filename /*, config, options */) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
  },
}
