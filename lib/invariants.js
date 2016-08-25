'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeWpApiGitHubUrl = 'http://bit.ly/2adfKKg';

exports.default = {
  isString: function isString(name, value) {
    return (0, _invariant2.default)(typeof value === 'string', 'Expecting %s to be string, got %s', name, typeof value === 'undefined' ? 'undefined' : _typeof(value));
  },
  isFunction: function isFunction(name, value) {
    return (0, _invariant2.default)(typeof value === 'function', 'Expecting %s to be function, got %s', name, typeof value === 'undefined' ? 'undefined' : _typeof(value));
  },
  isArray: function isArray(name, value) {
    return (0, _invariant2.default)(Array.isArray(value), 'Expecting %s to be array, got %s', name, typeof value === 'undefined' ? 'undefined' : _typeof(value));
  },
  isWpApiInstance: function isWpApiInstance() {
    var value = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return (0, _invariant2.default)(typeof value.registerRoute === 'function', 'Expecting WP to be instance of `node-wpapi`. ' + ('See ' + nodeWpApiGitHubUrl + ' for docs.'));
  },
  isIdentifier: function isIdentifier(identifier) {
    return (0, _invariant2.default)(typeof identifier === 'function' || typeof identifier === 'string' || typeof identifier === 'number', 'Expecting identifier to be function/string/number, got "%s"', typeof identifier === 'undefined' ? 'undefined' : _typeof(identifier));
  },
  isValidContentTypeObject: function isValidContentTypeObject() {
    var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return (0, _invariant2.default)(typeof obj.name === 'string' && typeof obj.plural === 'string' && typeof obj.slug === 'string',
    // TODO add in bit.ly link to docs
    'Invalid content type object, see documentation.');
  },
  isValidContentType: function isValidContentType(contentTypeOptions, name, componentName) {
    return (0, _invariant2.default)(typeof contentTypeOptions !== 'undefined', 'Content type "%s" is not recognised. ' + 'Pass built-ins from `kasia/types`, e.g. Post. ' + 'Pass the `name` of custom content types, e.g. "Book". ' + 'See the %s component.', name, componentName);
  },
  isNewContentType: function isNewContentType() {
    var allTypes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var contentType = arguments[1];
    return (0, _invariant2.default)(typeof allTypes[contentType.name] === 'undefined', 'Content type with name "%s" already exists.', contentType.name);
  },
  isNotWrapped: function isNotWrapped() {
    var target = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
    var targetName = arguments[1];
    return (0, _invariant2.default)(!target.__kasia, 'The component "%s" is already wrapped by Kasia.', targetName);
  },
  noWPInstance: function noWPInstance(WP) {
    return (0, _invariant2.default)(!WP, 'A WP instance is already set.');
  }
};