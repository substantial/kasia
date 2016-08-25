'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connectWpPost = require('./connectWpPost');

Object.defineProperty(exports, 'connectWpPost', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_connectWpPost).default;
  }
});

var _connectWpQuery = require('./connectWpQuery');

Object.defineProperty(exports, 'connectWpQuery', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_connectWpQuery).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }