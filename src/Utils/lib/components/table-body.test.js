'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _tableHeader = require('./table-header');

var _tableHeader2 = _interopRequireDefault(_tableHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)(_tableHeader2.default, {}, void 0, (0, _jsx3.default)('tr', {}, void 0, (0, _jsx3.default)('td', {}, void 0, 'Table Content')));

describe('<TableBody />', function () {
  test('should render correctly', function () {
    var wrapper = (0, _enzyme.mount)(_ref);
    expect(wrapper).toMatchSnapshot();
  });
});