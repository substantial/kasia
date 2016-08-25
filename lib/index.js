'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Kasia;

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require('redux-saga/effects');

var effects = _interopRequireWildcard(_effects);

var _invariants = require('./invariants');

var _invariants2 = _interopRequireDefault(_invariants);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _wpapi = require('./wpapi');

var _sagas = require('./sagas');

var _contentTypes = require('./contentTypes');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Components of the toolset that are extensible via plugins.
 * @type {Object}
 */
var componentsBase = {
  sagas: [_sagas.watchRequests],
  reducers: {}
};

/**
 * Configure Kasia.
 * @param {WP} opts.WP Instance of node-wpapi
 * @param {String} [opts.keyEntitiesBy] Property used to key entities in the store
 * @param {Array} [opts.plugins] Kasia plugins
 * @param {Array} [opts.contentTypes] Custom content type definition objects
 * @returns {Object} Kasia reducer
 */
function Kasia() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _opts$WP = opts.WP;
  var WP = _opts$WP === undefined ? {} : _opts$WP;
  var _opts$keyEntitiesBy = opts.keyEntitiesBy;
  var keyEntitiesBy = _opts$keyEntitiesBy === undefined ? 'id' : _opts$keyEntitiesBy;
  var _opts$plugins = opts.plugins;

  var _plugins = _opts$plugins === undefined ? [] : _opts$plugins;

  var _opts$contentTypes = opts.contentTypes;
  var contentTypes = _opts$contentTypes === undefined ? [] : _opts$contentTypes;


  _invariants2.default.isWpApiInstance(WP);
  _invariants2.default.isString('keyEntitiesBy', keyEntitiesBy);
  _invariants2.default.isArray('plugins', _plugins);
  _invariants2.default.isArray('contentTypes', contentTypes);

  (0, _wpapi.setWP)(WP);

  var plugins = _plugins.reduce(function (plugins, _plugin, i) {
    _invariants2.default.isFunction('plugin at index ' + i, _plugin instanceof Array ? _plugin[0] : _plugin);

    var plugin = _plugin instanceof Array ? _plugin[0](WP, _plugin[1] || {}, opts) : _plugin(WP, {}, opts);

    return {
      sagas: plugins.sagas.concat(plugin.sagas),
      reducers: (0, _lodash2.default)({}, plugins.reducers, plugin.reducers)
    };
  }, componentsBase);

  contentTypes.forEach(function (contentType) {
    return (0, _contentTypes.registerContentType)(WP, contentType);
  });

  return {
    kasiaReducer: (0, _reducer2.default)({ keyEntitiesBy: keyEntitiesBy }, plugins),
    kasiaSagas: plugins.sagas.map(function (saga) {
      return effects.spawn(saga);
    })
  };
}