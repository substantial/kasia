'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failRequest = exports.completeRequest = exports.createQueryRequest = exports.createPostRequest = undefined;

var _ActionTypes = require('./constants/ActionTypes');

/**
 * Initiate a request for a single entity from the WP-API.
 * @param {String} id Query identifier
 * @param {String} contentType The content type name
 * @param {String|Number} identifier The entity identifier, slug or ID
 * @returns {Object} Action object
 */
var createPostRequest = exports.createPostRequest = function createPostRequest(id, _ref) {
  var contentType = _ref.contentType;
  var identifier = _ref.identifier;
  return { type: _ActionTypes.Request.Create, request: _ActionTypes.RequestTypes.Post, id: id, contentType: contentType, identifier: identifier };
};

/**
 * Initiate an arbitrary request to the WP-API.
 * @param {String} id Query identifier
 * @param {Function} queryFn Function that returns WP-API request
 * @returns {Object} Action object
 */
var createQueryRequest = exports.createQueryRequest = function createQueryRequest(id, _ref2) {
  var queryFn = _ref2.queryFn;
  return { type: _ActionTypes.Request.Create, request: _ActionTypes.RequestTypes.Query, id: id, queryFn: queryFn };
};

/**
 * Place the result of a successful request on the store
 * @param {String} id Query identifier
 * @param {Object} data Raw WP-API response data
 */
var completeRequest = exports.completeRequest = function completeRequest(id, data) {
  return { type: _ActionTypes.Request.Complete, id: id, data: data };
};

/**
 * Update the record of a request with the error returned from a failed response.
 * @param {String} id Query identifier
 * @param {Error} error Error from failed request
 */
var failRequest = exports.failRequest = function failRequest(id, error) {
  return { type: _ActionTypes.Request.Fail, id: id, error: error };
};