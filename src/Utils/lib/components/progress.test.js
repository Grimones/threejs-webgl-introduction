'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _progress = require('./progress');

var _progress2 = _interopRequireDefault(_progress);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _mockSlideIndexReference = function _mockSlideIndexReference() {
  return [{ id: 0 }, { id: 1 }, { id: 'last' }];
};

describe('<Progress />', function () {
  test('should render PacMan correctly', function () {
    var context = { styles: { progress: { pacman: [] } } };
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_progress2.default, {
      type: 'pacman',
      items: _mockSlideIndexReference(),
      currentSlideIndex: 2
    }), { context: context });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the number style correctly', function () {
    var context = { styles: { progress: { number: [] } } };
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_progress2.default, {
      type: 'number',
      items: _mockSlideIndexReference(),
      currentSlideIndex: 1
    }), { context: context });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the bar style correctly', function () {
    var context = { styles: { progress: { bar: [] } } };
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_progress2.default, {
      type: 'bar',
      items: _mockSlideIndexReference(),
      currentSlideIndex: 1
    }), { context: context });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render nothing when none is provided.', function () {
    var context = { styles: { progress: {} } };
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_progress2.default, {
      type: 'none',
      items: _mockSlideIndexReference(),
      currentSlideIndex: 3
    }), { context: context });
    expect(wrapper).toMatchSnapshot();
  });
});