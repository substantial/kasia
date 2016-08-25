'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentTypesWithoutId = exports.ContentTypesPlural = exports.ContentTypes = undefined;

var _ContentTypesPlural;

exports.registerContentType = registerContentType;
exports.getContentType = getContentType;
exports.getContentTypes = getContentTypes;
exports.deriveContentType = deriveContentType;

var _filters = require('wpapi/lib/mixins/filters');

var _filters2 = _interopRequireDefault(_filters);

var _parameters = require('wpapi/lib/mixins/parameters');

var _parameters2 = _interopRequireDefault(_parameters);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _humps = require('humps');

var _invariants = require('./invariants');

var _invariants2 = _interopRequireDefault(_invariants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mixins = (0, _lodash2.default)({}, _filters2.default, _parameters2.default);

/**
 * The built-in content types available in WordPress.
 * @type {Object}
 */
var ContentTypes = exports.ContentTypes = {
  Category: 'category',
  Comment: 'comment',
  Media: 'media',
  Page: 'page',
  Post: 'post',
  PostStatus: 'status',
  PostType: 'type',
  PostRevision: 'revision',
  Tag: 'tag',
  Taxonomy: 'taxonomy',
  User: 'user'
};

/**
 * Plural names of the built-in content types. These are used in determining the
 * node-wpapi method to call when fetching a content type's respective data.
 * @type {Object}
 */
var ContentTypesPlural = exports.ContentTypesPlural = (_ContentTypesPlural = {}, _defineProperty(_ContentTypesPlural, ContentTypes.Category, 'categories'), _defineProperty(_ContentTypesPlural, ContentTypes.Comment, 'comments'), _defineProperty(_ContentTypesPlural, ContentTypes.Media, 'media'), _defineProperty(_ContentTypesPlural, ContentTypes.Page, 'pages'), _defineProperty(_ContentTypesPlural, ContentTypes.Post, 'posts'), _defineProperty(_ContentTypesPlural, ContentTypes.PostStatus, 'statuses'), _defineProperty(_ContentTypesPlural, ContentTypes.PostType, 'types'), _defineProperty(_ContentTypesPlural, ContentTypes.PostRevision, 'revisions'), _defineProperty(_ContentTypesPlural, ContentTypes.Tag, 'tags'), _defineProperty(_ContentTypesPlural, ContentTypes.Taxonomy, 'taxonomies'), _defineProperty(_ContentTypesPlural, ContentTypes.User, 'users'), _ContentTypesPlural);

/**
 * These content types do not have `id` properties.
 * @type {Array}
 */
var ContentTypesWithoutId = exports.ContentTypesWithoutId = [ContentTypesPlural[ContentTypes.Category], ContentTypesPlural[ContentTypes.PostType], ContentTypesPlural[ContentTypes.PostStatus], ContentTypesPlural[ContentTypes.Taxonomy]];

// Create the options object for a built-in content type
var makeBuiltInContentTypeOptions = function makeBuiltInContentTypeOptions(name) {
  return {
    name: name,
    plural: ContentTypesPlural[name],
    slug: ContentTypesPlural[name]
  };
};

// Pre-populate cache with built-in content type options
var optionsCache = Object.keys(ContentTypes).reduce(function (cache, key) {
  var name = ContentTypes[key];
  cache[name] = makeBuiltInContentTypeOptions(name);
  return cache;
}, {});

/**
 * Create and set the options object for a content type in the cache
 * and create the method on an instance of wpapi.
 * @param {Object} WP Instance of wpapi
 * @param {Object} contentType Content type options object
 * @returns {Object}
 */
function registerContentType(WP, contentType) {
  _invariants2.default.isValidContentTypeObject(contentType);
  _invariants2.default.isNewContentType(getContentTypes(), contentType);

  var _contentType$namespac = contentType.namespace;
  var namespace = _contentType$namespac === undefined ? 'wp/v2' : _contentType$namespac;
  var name = contentType.name;
  var methodName = contentType.methodName;
  var plural = contentType.plural;
  var route = contentType.route;
  var slug = contentType.slug;


  var realRoute = route || '/' + slug + '/(?P<id>)';
  var realMethodName = (0, _humps.camelize)(methodName || plural);

  optionsCache[name] = contentType;
  WP[realMethodName] = WP.registerRoute(namespace, realRoute, { mixins: mixins });
}

/**
 * Get the options for a content type.
 * @param {String} contentType The name of the content type
 * @returns {Object}
 */
function getContentType(contentType) {
  return optionsCache[contentType];
}

/**
 * Get all registered content types and their options.
 * @returns {Object}
 */
function getContentTypes() {
  return optionsCache;
}

/**
 * Derive the content type of an entity from the WP-API.
 * Accepts normalised (camel-case keys) or non-normalised data.
 * @param {Object} entity
 * @returns {String} The content type
 */
function deriveContentType(entity) {
  if (typeof entity.type !== 'undefined') {
    if (entity.type === 'comment') {
      return ContentTypes.Comment;
    } else if (entity.type === 'attachment') {
      return ContentTypes.Media;
    } else if (entity.type === 'page') {
      return ContentTypes.Page;
    } else if (entity.type === 'post') {
      return ContentTypes.Post;
    } else {
      // Custom content type
      return entity.type;
    }
  }

  if (typeof entity.public !== 'undefined' && typeof entity.queryable !== 'undefined' && typeof entity.slug !== 'undefined') {
    return ContentTypes.PostStatus;
  }

  if (typeof entity.taxonomy !== 'undefined') {
    if (entity.taxonomy === 'category') {
      return ContentTypes.Category;
    } else if (entity.taxonomy === 'post_tag') {
      return ContentTypes.Tag;
    }
  }

  if (entity.types instanceof Array) {
    return ContentTypes.Taxonomy;
  }

  if (typeof entity.description !== 'undefined' && typeof entity.hierarchical !== 'undefined' && typeof entity.name !== 'undefined') {
    return ContentTypes.PostType;
  }

  if (typeof entity.avatar_urls !== 'undefined' || typeof entity.avatarUrls !== 'undefined') {
    return ContentTypes.User;
  }
}