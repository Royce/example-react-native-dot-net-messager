// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  View
} from 'react-native';
import BlurView from './BlurView';

const dismissKeyboard = require('dismissKeyboard');   // TODO v. 36: Import Keyboard for dismissing
const {
  baseFontSize,
  actionFontSize,
  backgroundColor,
  backgroundColorOnBlur,
  foregroundColor,
  placeholderColor
} = require('./styles');


export default class ComposeMessageView extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.state.showComposeValue = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.timing(this.state.showComposeValue,
      {toValue: 1,
        easing: Easing.out(Easing.cubic),
      duration: 300}).start();
    this._firstInput.focus();
  }
  initialState(){
    return {
      message: "",
      name: "",
      email: "",
    }
  }
  clearAll = () => {
    this.setState(this.initialState());
  }
  cancel = () => {
    this.props.cancelling();
    this.removeAndClear();
  }
  removeAndClear = () => {
    Animated.timing(this.state.showComposeValue,
      {toValue: 0,
        easing: Easing.out(Easing.cubic),
      duration: 300})
      .start(()=> {
        this.clearAll();
        this.props.removed();
      });
    // Keyboard.dismiss(); v.next
    dismissKeyboard();
  }
  send = () => {
    this.props.submitting(this.state.message, this.state.name, this.state.email);
    this.removeAndClear();
  }

  render() {
    return (
      <View style={styles.composeMessageScreen}>
        <Animated.View style={[
            styles.composeMessageScreen,
            {opacity: this.state.showComposeValue}]}>
          <BlurView style={styles.composeMessageScreen}></BlurView>
        </Animated.View>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <Animated.View style={[
            styles.composeActions,
            {opacity: this.state.showComposeValue,
              top: this.state.showComposeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              })},
          ]}>
            <TouchableOpacity style={styles.composeAction} onPress={this.cancel}>
              <Text style={styles.composeActionText}>&lt; Cancel</Text>
            </TouchableOpacity>
            <TouchableHighlight style={styles.composeAction} onPress={this.send}>
              <Text style={styles.composeActionText}>Send</Text>
            </TouchableHighlight>
          </Animated.View>
          <Animated.View style={[
            styles.composeInputs,
            {
              opacity: this.state.showComposeValue
            }
          ]}>
            <TextInput
              multiline={true}
              ref={component => this._firstInput = component}
              style={[styles.composeInput, styles.multilineInput]}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
              placeholder="Type your message..."
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.composeInput, styles.defaultInput]}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
              placeholder="Name"
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.composeInput, styles.defaultInput]}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={placeholderColor}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

ComposeMessageView.defaultProps = {
  cancelling: () => {},
  removed: () => {},
  submitting: (message,name,email) => {},
};


const styles = StyleSheet.create({
  composeMessageScreen: {
    position: 'absolute',
    top: 0,
    bottom:0,
    left: 0,
    right: 0,
  },
  composeActions: {
    paddingTop: (Platform.OS === 'ios') ? 10 : 0, // Give more space for the status bar IOS
    margin: 20,
    position: 'relative',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  composeAction: {
  },
  composeActionText: {
    color: foregroundColor,
    fontSize: actionFontSize,
    fontFamily: (Platform.OS === 'android') ? 'Helvetica Neue' : 'System',
  },
  composeInputs: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    paddingTop: 0,
    marginBottom: (Platform.OS === 'android') ? 20 : 0 // Keyboard overlaps last input
  },
  composeInput: {
    fontSize: baseFontSize,
    padding: (baseFontSize/2),
    margin: 5,
    marginTop: 0,
    backgroundColor: backgroundColor,
    color: foregroundColor,
    fontFamily: (Platform.OS === 'android') ? 'Helvetica Neue Regular' : 'System',
    // borderRadius: 0,
  },
  defaultInput: {
    height: (baseFontSize*2.2),
  },
  multilineInput: {
    flex: 1,
    textAlignVertical: 'top',
  },
});
