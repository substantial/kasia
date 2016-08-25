'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalise;

var _normalizr = require('normalizr');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _wpApiResponseModify = require('wp-api-response-modify');

var _wpApiResponseModify2 = _interopRequireDefault(_wpApiResponseModify);

var _schemas = require('./schemas');

var _contentTypes = require('../contentTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Split a response from the WP-API into its constituent entities.
 * @param {Array} data The WP API response data
 * @param {String} idAttribute The property name of an entity's identifier
 * @returns {Object}
 */
function normalise(data, idAttribute) {
  var schemas = (0, _schemas.makeSchemas)(idAttribute);

  return data.reduce(function (entities, rawEntity) {
    var entity = (0, _wpApiResponseModify2.default)(rawEntity);
    var type = (0, _contentTypes.deriveContentType)(entity);

    var contentTypeSchema = schemas[type]
    // Built-in content type or previously registered custom content type
    ? schemas[type]
    // Custom content type, will only get here once for each type
    : (0, _schemas.createSchema)(type, idAttribute);

    var schema = Array.isArray(entity) ? (0, _normalizr.arrayOf)(contentTypeSchema) : contentTypeSchema;

    var normalised = (0, _normalizr.normalize)(entity, schema);

    return (0, _lodash2.default)({}, entities, normalised.entities);
  }, {});
}