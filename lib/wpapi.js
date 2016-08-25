'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWP = getWP;
exports.setWP = setWP;

var _invariants = require('./invariants');

var _invariants2 = _interopRequireDefault(_invariants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WP = null;

// Get the internal reference to the wpapi instance
function getWP() {
  return WP;
}

// Set an internal reference to the wpapi instance
function setWP(_WP) {
  _invariants2.default.noWPInstance(WP);
  WP = _WP;
}