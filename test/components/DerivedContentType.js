jest.disableAutomock();

import React, { Component } from 'react';

import connectWordPress from '../../src/connect';

@connectWordPress()
export default class DerivedPost extends Component {
  render () {
    return <div></div>;
  }
}
