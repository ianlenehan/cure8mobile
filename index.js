import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native'
import RNActionCable from 'react-native-actioncable'
import ActionCableProvider from 'react-actioncable-provider'
import Main from './src/main'

const cable = RNActionCable.createConsumer('wss://cure8.herokuapp.com/cable')

export default class App extends Component {
  render() {
    return (
      <ActionCableProvider cable={cable}>
        <Main />
      </ActionCableProvider>
    )
  }
}

AppRegistry.registerComponent('cure8mobile', () => App);
