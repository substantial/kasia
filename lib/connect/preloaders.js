'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWpPostPreloaderFn = makeWpPostPreloaderFn;
exports.makeWpQueryPreloaderFn = makeWpQueryPreloaderFn;

var _contentTypes = require('../contentTypes');

var _actions = require('../actions');

var _sagas = require('../sagas');

var _invariants = require('../invariants');

var _invariants2 = _interopRequireDefault(_invariants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Produce a universal preloader function for a connected WpQuery component.
 * @param {String} id Query identifier
 * @param {String} contentType The content type name
 * @param {Function} getIdentifier Function that derives entity identifier from props
 * @param {String} componentName Name of component preloader is created for
 * @returns {Function} Function that returns saga operation information
 */
function makeWpPostPreloaderFn(id, contentType, getIdentifier, componentName) {
  return function (renderProps) {
    _invariants2.default.isValidContentType((0, _contentTypes.getContentType)(contentType), contentType, componentName);
    var identifier = getIdentifier(renderProps);
    var action = (0, _actions.createPostRequest)(id, { contentType: contentType, identifier: identifier });
    return [_sagas.fetch, action];
  };
}

/**
 * Produce a universal preloader function for a connected WpQuery component.
 * @param {String} id Query identifier
 * @param {Function} queryFn Function that returns a WP-API request
 * @returns {Function} Function that returns saga operation information
 */
function makeWpQueryPreloaderFn(id, queryFn) {
  return function (renderProps) {
    var realQueryFn = function realQueryFn(wpapi) {
      return queryFn(wpapi, renderProps);
    };
    var action = (0, _actions.createQueryRequest)(id, { queryFn: realQueryFn });
    return [_sagas.fetch, action];
  };
}