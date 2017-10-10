"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Slide instance calls in its constructor.
var stepVisitor = function stepVisitor() {
  var frags = {};
  var index = 0;
  var setFragments = function setFragments(fragments, slideIndex) {
    frags = fragments;
    index = Number(slideIndex);
  };
  var getCount = function getCount() {
    var count = (0, _keys2.default)(frags).reduce(function (previous, key) {
      return previous + (frags[key].visible === true);
    }, 0);
    return { count: count, index: index };
  };

  return {
    setFragments: setFragments,
    getCount: getCount
  };
};

exports.default = stepVisitor;