'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chain = chain;
exports.derivedQueryFn = derivedQueryFn;
exports.resolveQueryFn = resolveQueryFn;
exports.fetch = fetch;
exports.watchRequests = watchRequests;

var _effects = require('redux-saga/effects');

var effects = _interopRequireWildcard(_effects);

var _humps = require('humps');

var _wpapi = require('./wpapi');

var _contentTypes = require('./contentTypes');

var _actions = require('./actions');

var _ActionTypes = require('./constants/ActionTypes');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _marked = [fetch, watchRequests].map(regeneratorRuntime.mark);

/**
 * Chain call methods beginning with `fn`.
 * @param {Object} obj The object to invoke calls on
 * @param {Object} calls The methods and their args to call
 */
function chain(obj, calls) {
  return calls.reduce(function (result, call) {
    var args = call[1];
    var methodName = call[0];
    return args ? result[methodName](args) : result[methodName]();
  }, obj);
}

/**
 * Create a function that dynamically calls the necessary wpapi
 * methods that will fetch data for the given content type item.
 *
 * Example returned fn for `contentType`="posts", `identifier`=16:
 * ```js
 * () => {
 *   return WP
 *     .posts()
 *     .id(16)
 *     .embed()
 *     .then((response) => response)
 * }
 * ```
 *
 * @param {Object} contentTypeMethodName The method name on wpapi instance
 * @param {String|Number} identifier The identifier's id or slug
 * @returns {Function} A function to make a request to the WP-API
 */
function derivedQueryFn(contentTypeMethodName, identifier) {
  return function () {
    return chain((0, _wpapi.getWP)(), [
    // Call the content type method
    [contentTypeMethodName, null],
    // Call the identifier method
    [typeof identifier === 'string' ? 'slug' : 'id', identifier],
    // Call 'embed' in order that embedded data is in the response
    ['embed'],
    // Call `then` in order to invoke query and return a Promise
    ['then', function (response) {
      return response;
    }]]);
  };
}

/**
 * Given an `action`, produce a function that will query the WP-API.
 * @param {Object} action
 * @returns {Function}
 */
function resolveQueryFn(action) {
  var contentType = action.contentType;
  var identifier = action.identifier;
  var queryFn = action.queryFn;


  var realQueryFn = void 0;

  if (action.request === _ActionTypes.RequestTypes.Post) {
    var options = (0, _contentTypes.getContentType)(contentType);
    var methodName = (0, _humps.camelize)(options.plural);
    realQueryFn = derivedQueryFn(methodName, identifier);
  } else if (action.request === _ActionTypes.RequestTypes.Query) {
    realQueryFn = queryFn;
  } else {
    throw new Error('Unknown request type "' + action.request + '".');
  }

  return realQueryFn;
}

/**
 * Make a fetch request to the WP-API according to the action
 * object and record the result in the store.
 * @param {Object} action Action object
 */
function fetch(action) {
  var id, result;
  return regeneratorRuntime.wrap(function fetch$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = action.id;
          _context.prev = 1;
          _context.next = 4;
          return effects.call(resolveQueryFn(action), (0, _wpapi.getWP)());

        case 4:
          result = _context.sent;
          _context.next = 7;
          return effects.put((0, _actions.completeRequest)(id, result));

        case 7:
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context['catch'](1);
          _context.next = 13;
          return effects.put((0, _actions.failRequest)(id, _context.t0));

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[1, 9]]);
}

function watchRequests() {
  var action;
  return regeneratorRuntime.wrap(function watchRequests$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!true) {
            _context2.next = 8;
            break;
          }

          _context2.next = 3;
          return effects.take(_ActionTypes.Request.Create);

        case 3:
          action = _context2.sent;
          _context2.next = 6;
          return effects.fork(fetch, action);

        case 6:
          _context2.next = 0;
          break;

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}