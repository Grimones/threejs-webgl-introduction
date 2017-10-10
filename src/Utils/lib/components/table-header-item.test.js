'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _tableHeaderItem = require('./table-header-item');

var _tableHeaderItem2 = _interopRequireDefault(_tableHeaderItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)(_tableHeaderItem2.default, {}, void 0, 'Header Text');

describe('<TableHeaderItem />', function () {
  test('should render correctly', function () {
    var context = {
      styles: {
        components: {
          tableHeaderItem: {
            color: '#e01'
          }
        }
      }
    };
    var wrapper = (0, _enzyme.mount)(_ref, {
      context: context
    });
    expect(wrapper).toMatchSnapshot();
  });
});