import React, { Component } from 'react';
import {View} from 'react-native';
import { BlurView } from 'react-native-blur';

export default class extends Component {
  render() {
    return (
      <BlurView blurType="light" {...this.props}>
        {/* This BlurView situation is frustrating. Too dark or too light. */}
        <View style={{flex:1, backgroundColor: '#0006'}}>
          {/* So we darken it here with a overlay. HACKY.
            TODO: investigate the ios only react-native-fxblurview */}
          {this.props.children}
        </View>
      </BlurView>
    );
  }
}
