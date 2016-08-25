'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = connectWpQuery;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.isequalwith');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

var _idGen = require('./idGen');

var _idGen2 = _interopRequireDefault(_idGen);

var _invariants = require('../invariants');

var _invariants2 = _interopRequireDefault(_invariants);

var _actions = require('../actions');

var _preloaders = require('./preloaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * IDs of queries created through the preloader.
 * @type {Array<Number>}
 */
var queryIds = [];

/**
 * Filter `entities` to contain only those whose ID is in `identifiers`.
 * @param {Object} entities Entities by type, e.g. { posts: {}, ... }
 * @param {Array} identifiers IDs of the entities to pick
 * @returns {Object}
 */
function pickEntities(entities, identifiers) {
  identifiers = identifiers.map(String);

  return Object.keys(entities).reduce(function (reduced, entityTypeName) {
    Object.keys(entities[entityTypeName]).forEach(function (entityId) {
      var obj = entities[entityTypeName][entityId];

      if (identifiers.indexOf(entityId) !== -1) {
        reduced[entityTypeName] = reduced[entityTypeName] || {};
        reduced[entityTypeName][entityId] = obj;
      }
    });

    return reduced;
  }, {});
}

/**
 * Determine if a value is a primitive. (http://bit.ly/2bf3FYJ)
 * @param {*} value Value to inspect
 * @returns {Boolean} Whether value is primitive
 */
function isPrimitive(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value == null || type !== 'object' && type !== 'function';
}

/**
 * Only inspect primitives by default.
 * Returning `undefined` makes isEqualWith fallback to built-in comparator.
 * @param {Object} thisProps Current props object
 * @param {Object} nextProps Next props object
 * @returns {Boolean}
 */
function defaultPropsComparator(thisProps, nextProps) {
  return (0, _lodash2.default)(thisProps, nextProps, function (value) {
    return isPrimitive(value) ? undefined : true;
  });
}

/**
 * Connect a component to arbitrary data from a WP-API query. By default
 * the component will request new data via the given `queryFn` if the
 * `propsComparatorFn` returns true. The default property comparison
 * is performed only on primitive values on the props objects.
 *
 * Example, get all posts by an author:
 * ```js
 * connectWpQuery((wp) => wp.posts().embed().author('David Bowie').get())
 * ```
 *
 * Example, get all pages:
 * ```js
 * connectWpQuery((wp) => wp.pages().embed().get())
 * ```
 *
 * Example, get custom content type by slug (content type registered at init):
 * ```js
 * connectWpQuery((wp) => {
 *   return wp.news()
 *     .slug('gullible-removed-from-the-dictionary')
 *     .embed()
 *     .get()
 * })
 * ```
 *
 * Example, with custom props comparator:
 * ```js
 * connectWpQuery((wp) => wp.pages().embed().get(), (thisProps, nextProps) => {
 *   return thisProps.identifier() !== nextProps.identifier()
 * })
 * ```
 *
 * @params {Function} queryFn Function that returns a wpapi query
 * @params {Function} propsComparatorFn Function that determines if new data should be requested by inspecting props
 * @returns {Function} Decorated component
 */
function connectWpQuery(queryFn) {
  var propsComparatorFn = arguments.length <= 1 || arguments[1] === undefined ? defaultPropsComparator : arguments[1];

  _invariants2.default.isFunction('queryFn', queryFn);
  _invariants2.default.isFunction('propsComparatorFn', propsComparatorFn);

  return function (target) {
    var _class, _temp;

    var targetName = target.displayName || target.name;

    _invariants2.default.isNotWrapped(target, targetName);

    var mapStateToProps = function mapStateToProps(state) {
      return {
        wordpress: state.wordpress
      };
    };

    var KasiaIntermediateComponent = (_temp = _class = function (_Component) {
      _inherits(KasiaIntermediateComponent, _Component);

      function KasiaIntermediateComponent() {
        _classCallCheck(this, KasiaIntermediateComponent);

        return _possibleConstructorReturn(this, (KasiaIntermediateComponent.__proto__ || Object.getPrototypeOf(KasiaIntermediateComponent)).apply(this, arguments));
      }

      _createClass(KasiaIntermediateComponent, [{
        key: 'render',
        value: function render() {
          var props = (0, _lodash4.default)({}, this.props, this.reconcileKasiaData());
          return _react2.default.createElement(target, props);
        }

        /**
         * Build an object of properties containing entity and query data maintained by Kasia.
         * @returns {Object} Props object
         */

      }, {
        key: 'reconcileKasiaData',
        value: function reconcileKasiaData() {
          var _props$wordpress = this.props.wordpress;
          var queries = _props$wordpress.queries;
          var _entities = _props$wordpress.entities;

          var query = queries[this.queryId];

          if (!query) {
            return {
              kasia: {
                query: { complete: false },
                entities: {}
              }
            };
          }

          var entities = pickEntities(_entities, query.entities);

          return { kasia: { query: query, entities: entities } };
        }

        // Dispatch a new data request action to fetch data according to the props

      }, {
        key: 'dispatch',
        value: function dispatch(props) {
          var wrappedQueryFn = function wrappedQueryFn(wpapi) {
            return queryFn(wpapi, props);
          };
          var action = (0, _actions.createQueryRequest)(this.queryId, { queryFn: wrappedQueryFn });
          this.props.dispatch(action);
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.queryId = queryIds.length ? queryIds.shift() : (0, _idGen2.default)();
          this.dispatch(this.props);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_nextProps) {
          // Nullify `wordpress` on props objects so that they aren't compared otherwise
          // the addition of a new query object each time will cause infinite dispatches
          var thisProps = (0, _lodash4.default)({}, this.props, { wordpress: null });
          var nextProps = (0, _lodash4.default)({}, _nextProps, { wordpress: null });

          // Make a request for new data if the current props and next props are different
          if (!propsComparatorFn(thisProps, nextProps)) {
            this.queryId = queryIds.length ? queryIds.shift() : (0, _idGen2.default)();
            this.dispatch(nextProps);
          }
        }
      }]);

      return KasiaIntermediateComponent;
    }(_react.Component), _class.__kasia = true, _class.makePreloader = function () {
      var id = (0, _idGen2.default)();
      queryIds.push(id);
      return (0, _preloaders.makeWpQueryPreloaderFn)(id, queryFn);
    }, _temp);


    return (0, _reactRedux.connect)(mapStateToProps)(KasiaIntermediateComponent);
  };
}