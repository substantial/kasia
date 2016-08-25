'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failReducer = exports.completeReducer = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.pickEntityIds = pickEntityIds;
exports.default = makeReducer;

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _pickToArray = require('pick-to-array');

var _pickToArray2 = _interopRequireDefault(_pickToArray);

var _index = require('./normalise/index');

var _index2 = _interopRequireDefault(_index);

var _contentTypes = require('./contentTypes');

var _ActionTypes = require('./constants/ActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Pick all entity identifiers from a raw WP-API response.
 * @param {Object} data Raw WP-API JSON
 * @returns {Array} Entity identifiers
 */
function pickEntityIds(data) {
  var entityIdentifiers = (0, _pickToArray2.default)(data, 'id');

  // Accommodate content types that do not have an `id` property
  data.forEach(function (entity) {
    var type = (0, _contentTypes.deriveContentType)(entity);
    if (_contentTypes.ContentTypesWithoutId[type]) {
      entityIdentifiers.push((0, _pickToArray2.default)(entity, 'slug'));
    }
  });

  return entityIdentifiers;
}

// COMPLETE
// Place entity on the store; update query record
// The entities are normalised by the `keyEntitiesBy` parameter passed in during
// creation of the action fn, however entities are recorded in the query by their IDs
// (or slugs if they do not have an ID property) and resolved later within the HOC.
var completeReducer = exports.completeReducer = function completeReducer(keyEntitiesBy) {
  return function (state, action) {
    var data = action.data instanceof Array ? action.data : [action.data];
    var entities = (0, _index2.default)(data, keyEntitiesBy);

    return (0, _lodash2.default)({}, state, {
      entities: entities,
      queries: _defineProperty({}, action.id, {
        id: action.id,
        entities: pickEntityIds(data),
        paging: action.data._paging || false,
        complete: true,
        OK: true
      })
    });
  };
};

// FAIL
// Update query record only
var failReducer = exports.failReducer = function failReducer(state, action) {
  return (0, _lodash2.default)({}, state, {
    queries: _defineProperty({}, action.id, {
      id: action.id,
      error: String(action.error),
      complete: true,
      OK: false
    })
  });
};

/**
 * Make the reducer for Kasia.
 * @param {Object} options Options object
 * @param {Object} plugins Plugin configurations, e.g. sagas/config
 * @returns {Object} Kasia reducer
 */
function makeReducer(options, plugins) {
  var _merge;

  var keyEntitiesBy = options.keyEntitiesBy;


  var reducer = (0, _lodash2.default)({}, plugins.reducers, (_merge = {}, _defineProperty(_merge, _ActionTypes.Request.Complete, completeReducer(keyEntitiesBy)), _defineProperty(_merge, _ActionTypes.Request.Fail, failReducer), _merge));

  var initialState = {
    // Record query requests to the WP-API here
    queries: {},
    // Entities are normalised and stored here
    entities: {}
  };

  return {
    wordpress: function kasiaReducer() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
      var action = arguments[1];

      var _action$type$split = action.type.split('/');

      var _action$type$split2 = _slicedToArray(_action$type$split, 1);

      var actionNamespace = _action$type$split2[0];


      if (actionNamespace === 'kasia' && action.type in reducer) {
        return reducer[action.type](state, action);
      }

      return state;
    }
  };
}