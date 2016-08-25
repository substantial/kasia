'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connectWpPost;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _idGen = require('./idGen');

var _idGen2 = _interopRequireDefault(_idGen);

var _invariants = require('../invariants');

var _invariants2 = _interopRequireDefault(_invariants);

var _actions = require('../actions');

var _contentTypes = require('../contentTypes');

var _preloaders = require('./preloaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * IDs of queries created through the preloader.
 * @type {Array<Number>}
 */
var queryIds = [];

/**
 * Find an entity in `entities` with the given `identifier`.
 * @param {Object} entities Entity collection
 * @param {String|Number} identifier Entity ID or slug
 * @returns {Object}
 */
function findEntity(entities, identifier) {
  if (typeof identifier === 'number') {
    return entities[identifier];
  }

  var entity = null;

  Object.keys(entities).forEach(function (key) {
    if (entities[key].slug === identifier) {
      entity = entities[key];
      return false;
    }
  });

  return entity;
}

/**
 * Connect a component to a single entity from the WP-API.
 *
 * Built-in content type, derived slug identifier:
 * ```js
 * const { Page } from 'kasia/types'
 * connectWordPress(Page, (props) => props.params.slug)(Component)
 * ```
 *
 * Built-in content type, explicit ID identifier:
 * ```js
 * const { Post } from 'kasia/types'
 * connectWordPress(Post, 16)(Component)
 * ```
 *
 * Custom content type, derived identifier:
 * ```js
 * connectWordPress('News', (props) => props.params.slug)(Component)
 * ```
 *
 * @params {String} contentType The content type of the data to fetch from WP-API
 * @params {Function|String|Number} id The entity's ID or slug or a function that derives either from props
 * @returns {Function} Decorated component
 */
function connectWpPost(contentType, id) {
  return function (target) {
    var _class, _temp;

    var targetName = target.displayName || target.name;
    var getIdentifier = function getIdentifier(props) {
      return typeof id === 'function' ? id(props) : id;
    };

    _invariants2.default.isNotWrapped(target, targetName);
    _invariants2.default.isString('contentType', contentType);
    _invariants2.default.isIdentifier(id);

    var mapStateToProps = function mapStateToProps(state, ownProps) {
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
          _invariants2.default.isValidContentType((0, _contentTypes.getContentType)(contentType), contentType, targetName);
          var props = (0, _lodash2.default)({}, this.props, this.reconcileKasiaData(this.props));
          return _react2.default.createElement(target, props);
        }

        /**
         * Build an object of properties containing entity and query data maintained by Kasia.
         * @params {Object} Props object to use for reconciliation
         * @returns {Object} Props object
         */

      }, {
        key: 'reconcileKasiaData',
        value: function reconcileKasiaData(props) {
          var _getContentType = (0, _contentTypes.getContentType)(contentType);

          var plural = _getContentType.plural;
          var name = _getContentType.name;

          var query = props.wordpress.queries[this.queryId];

          if (!query) {
            return {
              kasia: _defineProperty({
                query: { complete: false }
              }, name, null)
            };
          }

          var entityCollection = props.wordpress.entities[plural] || {};
          var entityId = getIdentifier(props);

          return {
            kasia: _defineProperty({
              query: query
            }, name, findEntity(entityCollection, entityId))
          };
        }

        // Dispatch a new request action to fetch data according to the props

      }, {
        key: 'dispatch',
        value: function dispatch(props) {
          var identifier = getIdentifier(props);
          var action = (0, _actions.createPostRequest)(this.queryId, { contentType: contentType, identifier: identifier });
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
        value: function componentWillReceiveProps(nextProps) {
          var _getContentType2 = (0, _contentTypes.getContentType)(contentType);

          var name = _getContentType2.name;

          var shouldDispatch = getIdentifier(nextProps) !== getIdentifier(this.props);
          var nextBuiltProps = this.reconcileKasiaData(nextProps);

          // Make a request for new data if:
          //  - the identifier has changed
          //  - an entity cannot be derived from the store using `nextProps`
          if (shouldDispatch && !nextBuiltProps.kasia[name]) {
            this.queryId = queryIds.length ? queryIds.shift() : (0, _idGen2.default)();
            this.dispatch(nextProps);
          }
        }
      }]);

      return KasiaIntermediateComponent;
    }(_react.Component), _class.__kasia = true, _class.makePreloader = function () {
      var id = queryIds.length;
      queryIds.push(id);
      return (0, _preloaders.makeWpPostPreloaderFn)(id, contentType, getIdentifier, targetName);
    }, _temp);


    return (0, _reactRedux.connect)(mapStateToProps)(KasiaIntermediateComponent);
  };
}