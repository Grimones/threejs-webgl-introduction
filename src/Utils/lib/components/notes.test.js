'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _notes = require('./notes');

var _notes2 = _interopRequireDefault(_notes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mockContext = function mockContext(currentSlide, parentSlide) {
  var updateNotes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  return {
    updateNotes: updateNotes,
    slideHash: parentSlide,
    store: {
      getState: function getState() {
        return {
          route: {
            slide: currentSlide
          }
        };
      }
    }
  };
};

var _ref = (0, _jsx3.default)(_notes2.default, {}, void 0, (0, _jsx3.default)('ul', {}, void 0, (0, _jsx3.default)('li', {}, void 0, 'First'), (0, _jsx3.default)('li', {}, void 0, 'Second')));

var _ref2 = (0, _jsx3.default)('ul', {}, void 0, (0, _jsx3.default)('li', {}, void 0, 'First'), (0, _jsx3.default)('li', {}, void 0, 'Second'));

describe('<Notes />', function () {
  test('should render correctly', function () {
    var wrapper = (0, _enzyme.mount)(_ref, { context: mockContext(1, '2') });
    expect(wrapper).toMatchSnapshot();
  });

  test('should update notes on matching slide', function () {
    var updateNotes = jest.fn();
    var children = _ref2;
    var vDom = (0, _jsx3.default)(_notes2.default, {}, void 0, children);

    (0, _enzyme.mount)(vDom, { context: mockContext('1', 2, updateNotes) });
    expect(updateNotes.mock.calls.length).toEqual(0);

    (0, _enzyme.mount)(vDom, { context: mockContext('2', 2, updateNotes) });
    expect(updateNotes.mock.calls.length).toEqual(1);
    expect(updateNotes.mock.calls[0]).toEqual([children]);

    (0, _enzyme.mount)(vDom, { context: mockContext('hurz', 'hurz', updateNotes) });
    expect(updateNotes.mock.calls.length).toEqual(2);
    expect(updateNotes.mock.calls[0]).toEqual([children]);
  });
});