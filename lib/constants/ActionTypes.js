'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RequestTypes = exports.RequestTypes = {
  // Requesting a single entity from the WP API
  Post: 'Post',
  // Requesting a arbitrary query against WP API
  Query: 'Query'
};

var Request = exports.Request = {
  // Initiate a request to the WP API
  Create: 'kasia/REQUEST_CREATE',
  // Place a record of a request on the store
  Put: 'kasia/REQUEST_PUT',
  // Place the result of a request on the store
  Complete: 'kasia/REQUEST_COMPLETE',
  // Record the failure of a request on the store
  Fail: 'kasia/REQUEST_FAILED'
};