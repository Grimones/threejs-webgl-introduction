'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _slideSet = require('./slide-set');

var _slideSet2 = _interopRequireDefault(_slideSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _mockContext = function _mockContext() {
  return {};
};

var _ref = (0, _jsx3.default)('div', {}, void 0, 'Slide Content');

var MockSlide = function (_Component) {
  (0, _inherits3.default)(MockSlide, _Component);

  function MockSlide() {
    (0, _classCallCheck3.default)(this, MockSlide);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  MockSlide.prototype.render = function render() {
    return _ref;
  };

  return MockSlide;
}(_react.Component);

var _ref2 = (0, _jsx3.default)(_slideSet2.default, {}, void 0, (0, _jsx3.default)(MockSlide, {}), (0, _jsx3.default)(MockSlide, {}));

describe('<SlideSet />', function () {
  test('should render correctly', function () {
    var wrapper = (0, _enzyme.mount)(_ref2, { context: _mockContext() });
    expect(wrapper).toMatchSnapshot();
  });
});