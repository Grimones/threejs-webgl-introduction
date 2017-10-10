'use strict';

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _componentPlayground = require('./component-playground');

var _componentPlayground2 = _interopRequireDefault(_componentPlayground);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = (0, _jsx3.default)(_componentPlayground2.default, {
  theme: 'dark'
});

var _ref2 = (0, _jsx3.default)(_componentPlayground2.default, {
  theme: 'light'
});

var _ref3 = (0, _jsx3.default)(_componentPlayground2.default, {
  theme: 'light',
  previewBackgroundColor: '#ff0'
});

var _ref4 = (0, _jsx3.default)('div', {}, void 0, (0, _jsx3.default)('h1', {}, void 0, 'Hi!'));

describe('<ComponentPlayground />', function () {
  test('Should render the dark theme correctly', function () {
    var wrapper = (0, _enzyme.render)(_ref);
    expect(wrapper).toMatchSnapshot();
  });

  test('Should render the light theme correctly', function () {
    var wrapper = (0, _enzyme.render)(_ref2);
    expect(wrapper).toMatchSnapshot();
  });

  test('Should render with a custom background color', function () {
    var wrapper = (0, _enzyme.render)(_ref3);
    expect(wrapper).toMatchSnapshot();
  });

  test('Should render with a custom code block', function () {
    var code = '\n      const Button = ({ title }) => (<button type="button">{ title }</button>);\n      render(<Button title="My Button" />, mountNode);\n    ';
    var wrapper = (0, _enzyme.render)((0, _jsx3.default)(_componentPlayground2.default, {
      theme: 'light',
      code: code,
      previewBackgroundColor: '#ff0'
    }));
    expect(wrapper).toMatchSnapshot();
  });

  test('Should render custom scoped components', function () {
    var NewComponent = function NewComponent() {
      return _ref4;
    };
    var wrapper = (0, _enzyme.shallow)((0, _jsx3.default)(_componentPlayground2.default, {
      scope: { NewComponent: NewComponent }
    }));

    var scope = wrapper.find('ReactPlayground').prop('scope');
    expect(scope.NewComponent).toEqual(NewComponent);
  });
});