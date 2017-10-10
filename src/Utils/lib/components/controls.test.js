'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _controls = require('./controls');

var _controls2 = _interopRequireDefault(_controls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Controls />', function () {
  test('should render correctly.', function () {
    var context = {
      styles: {
        controls: {
          prev: { background: '#f00' },
          next: { background: '#f0f' }
        }
      }
    };
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_controls2.default, {
      currentSlideIndex: 2,
      totalSlides: 5,
      onPrev: function onPrev() {},
      onNext: function onNext() {}
    }), { context: context });
    expect(wrapper).toMatchSnapshot();
  });

  test('should call the next function when the next button is selected', function () {
    var context = { styles: { controls: {} } };
    var nextFunc = jest.fn();
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_controls2.default, {
      currentSlideIndex: 2,
      totalSlides: 5,
      onPrev: function onPrev() {},
      onNext: nextFunc
    }), { context: context });
    wrapper.findWhere(function (node) {
      return node.name() === 'button' && node.key() === '.$next';
    }).simulate('click');
    expect(nextFunc).toHaveBeenCalledTimes(1);
  });

  test('should call the prev function when the previous button is selected', function () {
    var context = { styles: { controls: {} } };
    var prevFunc = jest.fn();
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_controls2.default, {
      currentSlideIndex: 3,
      totalSlides: 5,
      onPrev: prevFunc,
      onNext: function onNext() {}
    }), { context: context });
    wrapper.findWhere(function (node) {
      return node.name() === 'button' && node.key() === '.$prev';
    }).simulate('click');
    expect(prevFunc).toHaveBeenCalledTimes(1);
  });
});