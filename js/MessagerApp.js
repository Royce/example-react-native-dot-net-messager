/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableHighlight,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';

import ComposeMessageView from './ComposeMessageView';
const { BlurView } = require('react-native-blur');
const {messageFontSize, backgroundColor, foregroundColor} = require('./styles');

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

//
// Mock fetch
//
// function fetch() {
//   return new Promise(function (resolve, rej) {
//     setTimeout(function () {
//       resolve({ok:true});
//     }, 1000);
//   });
// };

export default class MessagerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    this.showButton();
  }
  composeMessage = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({showCompose: true, showButton: false});
  }
  showButton = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({showButton: true});
  }
  submit = (message, name, email) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({submitting: true});

    return fetch('http://localhost:5000/api/messages/add',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          text: message,
        })
      })
      .then((response) => {
        if(response.ok) {
          LayoutAnimation.easeInEaseOut();
          this.setState({submitting:false, submitted:true});

          Animated.delay(1000).start(()=>{
            LayoutAnimation.easeInEaseOut();
            this.setState({submitting:false, submitted:false, showButton:true});
          });
        } else {
          alert('Network response was not ok.');
          LayoutAnimation.easeInEaseOut();
          this.setState({submitting:false, submitted:false, showButton:true});
        }
      })
      .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
      });
  }
  render() {
    return (
      <Image source={require('./../background.jpg')}
      style={styles.container}>

        {this.state.showCompose ?
          <ComposeMessageView
            cancelling={() => {this.showButton();}}
            removed={()=> {this.setState({showCompose: false});}}
            submitting={this.submit}
          />
        :null}

        {(this.state.submitting || this.state.submitted) ?
          <View key="messages" style={styles.bigMessage}>
            {this.state.submitting ?
              <ActivityIndicator animating={true} style={{paddingTop: 10}} />
            :null}
            <Text style={styles.bigButtonText}>
              {this.state.submitting ? "Sending Message..." : "Sent!"}
            </Text>
          </View>
        :null}
        {this.state.showButton ?
          <View key="sendButton" style={[
            styles.bigButton,
            // {opacity: this.state.showButtonValue}
          ]}>
            <TouchableHighlight onPress={this.composeMessage}>
              <Text style={styles.bigButtonText}>Send Message</Text>
            </TouchableHighlight>
          </View>
        :null}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    resizeMode: 'cover',
    height:null,
    width:null,
  },
  bigMessage: {
    margin: 50,
    padding: 5,
    backgroundColor: backgroundColor,
  },
  bigButton: {
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 50,
    padding: 5,
    backgroundColor: backgroundColor,
  },
  bigButtonText: {
    fontFamily: (Platform.OS === 'android') ? 'Helvetica Neue' : 'System',
    fontSize: messageFontSize,
    textAlign: 'center',
    margin: 10,
    color: foregroundColor,
  },
});
