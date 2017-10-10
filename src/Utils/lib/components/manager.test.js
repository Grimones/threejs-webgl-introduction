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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enzyme = require('enzyme');

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _mockContext = function _mockContext(slide, routeParams) {
  return {
    styles: {
      global: {
        body: []
      },
      controls: {},
      progress: {
        pacman: []
      }
    },
    store: {
      getState: function getState() {
        return {
          route: {
            params: routeParams,
            slide: slide
          },
          style: {
            globalStyleSet: []
          }
        };
      },
      dispatch: function dispatch() {},
      subscribe: function subscribe() {}
    }
  };
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

var MockSlideSet = function (_Component2) {
  (0, _inherits3.default)(MockSlideSet, _Component2);

  function MockSlideSet() {
    (0, _classCallCheck3.default)(this, MockSlideSet);
    return (0, _possibleConstructorReturn3.default)(this, _Component2.apply(this, arguments));
  }

  MockSlideSet.prototype.render = function render() {
    return (0, _jsx3.default)('div', {}, void 0, this.props.children);
  };

  return MockSlideSet;
}(_react.Component);

MockSlideSet.defaultProps = {
  hasSlideChildren: true
};


var _mockChildContext = function _mockChildContext() {
  return { styles: function styles() {} };
};

var _ref2 = (0, _jsx3.default)(MockSlide, {});

var _ref3 = (0, _jsx3.default)(MockSlide, {});

var _ref4 = (0, _jsx3.default)(_manager2.default, {}, void 0, (0, _jsx3.default)(MockSlide, {}), (0, _jsx3.default)(MockSlide, {}));

var _ref5 = (0, _jsx3.default)(_manager2.default, {}, void 0, (0, _jsx3.default)(MockSlide, {}), (0, _jsx3.default)(MockSlide, {}));

var _ref6 = (0, _jsx3.default)(_manager2.default, {}, void 0, (0, _jsx3.default)(MockSlide, {}), (0, _jsx3.default)(MockSlideSet, {}, void 0, (0, _jsx3.default)(MockSlide, {}), (0, _jsx3.default)(MockSlide, {})));

describe('<Manager />', function () {
  test('should render correctly.', function () {
    var wrapper = (0, _enzyme.mount)((0, _jsx3.default)(_manager2.default, {
      transition: ['zoom', 'slide'],
      transitionDuration: 500
    }, void 0, _ref2, _ref3), { context: _mockContext(0, []), childContextTypes: _mockChildContext() });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the export configuration when specified.', function () {
    var wrapper = (0, _enzyme.mount)(_ref4, {
      context: _mockContext(0, ['export']),
      childContextTypes: _mockChildContext()
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the overview configuration when specified.', function () {
    var wrapper = (0, _enzyme.mount)(_ref5, {
      context: _mockContext(0, ['overview']),
      childContextTypes: _mockChildContext()
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('should render with slideset slides', function () {
    var wrapper = (0, _enzyme.mount)(_ref6, { context: _mockContext(1, []), childContextTypes: _mockChildContext() });
    expect(wrapper).toMatchSnapshot();
  });
});