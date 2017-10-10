'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _quote = require('./quote');

var _quote2 = _interopRequireDefault(_quote);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)(_quote2.default, {}, void 0, 'Hello There!');

describe('<Quote />', function () {
  test('should render correctly', function () {
    var context = {
      styles: {
        components: {
          quote: {
            color: '#ff0'
          }
        }
      }
    };
    var wrapper = (0, _enzyme.mount)(_ref, { context: context });
    expect(wrapper).toMatchSnapshot();
  });
});