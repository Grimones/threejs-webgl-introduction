'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slides = require('./slides');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)('div', {}, 0);

var _ref2 = (0, _jsx3.default)('div', {}, 1);

var _ref3 = (0, _jsx3.default)('div', {}, 0);

var _ref4 = (0, _jsx3.default)('div', {
  hasSlideChildren: true
}, 1, (0, _jsx3.default)('div', {}, 0), (0, _jsx3.default)('div', {}, 1));

describe('slides', function () {
  describe('countSlides', function () {
    test('should count standard slides', function () {
      var children = [_ref, _ref2];
      expect((0, _slides.countSlides)(children)).toBe(2);
    });

    test('should count slide sets', function () {
      var children = [_ref3, _ref4];
      expect((0, _slides.countSlides)(children)).toBe(3);
    });
  });
});