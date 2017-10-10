'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _fill = require('./fill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)(_fill.Fill, {}, void 0, 'Spectacle');

describe('<Fill />', function () {
  test('should render with style `flex: 1`', function () {
    var wrapper = (0, _enzyme.mount)(_ref);
    expect(wrapper).toMatchSnapshot();
  });
});