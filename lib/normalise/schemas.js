'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = createSchema;
exports.makeSchemas = makeSchemas;

var _normalizr = require('normalizr');

var _contentTypes = require('../contentTypes');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Schema object cache, populated in `makeSchemas`
 * @type {Object}
 */
var schemas = void 0;

/**
 * Individual schema definitions, defined like this so we can reference one from another
 * @tpe {Schema}
 */
var categorySchema = void 0,
    mediaSchema = void 0,
    pageSchema = void 0,
    postSchema = void 0,
    revisionSchema = void 0,
    tagSchema = void 0,
    userSchema = void 0,
    commentSchema = void 0,
    postTypeSchema = void 0,
    postStatusSchema = void 0,
    taxonomySchema = void 0;

/**
 * The last value passed as the `idAttribute` on calling `makeSchemas`.
 * This is here so that it is possible to clear and re-populate the schema cache during tests.
 * @type {String}
 */
var lastIdAttribute = void 0;

/**
 * Create a custom schema definition (for custom content types).
 * @param {String} name Name of the schema
 * @param {String} idAttribute The key of an entity used to identify it
 * @returns {Schema} Schema instance
 */
function createSchema(name, idAttribute) {
  if (!schemas) {
    throw new Error('createSchema called before schema cache populated, call makeSchemas first.');
  }

  var contentTypeSchema = new _normalizr.Schema(name, { idAttribute: idAttribute });

  contentTypeSchema.define({
    author: userSchema,
    post: postSchema,
    featuredMedia: mediaSchema
  });

  return contentTypeSchema;
}

/**
 * Populate the cache of schemas for built-in content types.
 * @param {String} idAttribute The key of an entity used to identify it
 * @returns {Object} Schema cache
 */
function makeSchemas(idAttribute) {
  var _schemas;

  if (schemas && lastIdAttribute === idAttribute) {
    return schemas;
  }

  lastIdAttribute = idAttribute;

  // Content types with `id` properties
  categorySchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Category], { idAttribute: idAttribute });
  commentSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Comment], { idAttribute: idAttribute });
  mediaSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Media], { idAttribute: idAttribute });
  pageSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Page], { idAttribute: idAttribute });
  postSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Post], { idAttribute: idAttribute });
  revisionSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.PostRevision], { idAttribute: idAttribute });
  tagSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Tag], { idAttribute: idAttribute });
  userSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.User], { idAttribute: idAttribute });

  // Content types without `id` properties
  postTypeSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.PostType], { idAttribute: 'slug' });
  postStatusSchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.PostStatus], { idAttribute: 'slug' });
  taxonomySchema = new _normalizr.Schema(_contentTypes.ContentTypesPlural[_contentTypes.ContentTypes.Taxonomy], { idAttribute: 'slug' });

  mediaSchema.define({
    author: userSchema,
    post: postSchema
  });

  pageSchema.define({
    author: userSchema,
    featuredMedia: mediaSchema
  });

  postSchema.define({
    author: userSchema,
    featuredMedia: mediaSchema,
    categories: (0, _normalizr.arrayOf)(categorySchema),
    tags: (0, _normalizr.arrayOf)(tagSchema)
  });

  schemas = (_schemas = {}, _defineProperty(_schemas, _contentTypes.ContentTypes.Category, categorySchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Comment, commentSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Media, mediaSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Page, pageSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Post, postSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.PostStatus, postStatusSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.PostType, postTypeSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.PostRevision, revisionSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Tag, tagSchema), _defineProperty(_schemas, _contentTypes.ContentTypes.Taxonomy, taxonomySchema), _defineProperty(_schemas, _contentTypes.ContentTypes.User, userSchema), _schemas);

  return schemas;
}