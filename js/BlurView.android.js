import React, { Component } from 'react';
import {View} from 'react-native';

// Todo: Find a reasonable blurring library/component that works.

export default class extends Component {
  render() {
    return (
      <View style={[{backgroundColor: '#3339'}, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}
