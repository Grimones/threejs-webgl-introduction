'use strict';

require('prismjs/themes/prism-tomorrow.css');

var _prismCore = require('prismjs/components/prism-core');

var _prismCore2 = _interopRequireDefault(_prismCore);

require('prismjs/components/prism-clike');

require('prismjs/components/prism-markup');

require('prismjs/components/prism-javascript');

require('prismjs/components/prism-jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memoize = require('lodash.memoize');


function getHighlightedCodeLines(code, lang) {
  return _prismCore2.default.highlight(code, _prismCore2.default.languages[lang]).split('\n');
}

module.exports = memoize(getHighlightedCodeLines);