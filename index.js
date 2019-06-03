import React, { Component } from "react";
import { AppRegistry } from "react-native";
import RNActionCable from "react-native-actioncable";
import ActionCableProvider from "react-actioncable-provider";
import OneSignal from "react-native-onesignal";
import ApolloClient from "apollo-boost/lib/index";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import Main from "./src/main";
const rootURL = "http://localhost:3000/";

const cable = RNActionCable.createConsumer("wss://cure8.herokuapp.com/cable");
const client = new ApolloClient({ uri: `${rootURL}graphql` });

export default class App extends Component {
  componentWillMount() {
    OneSignal.init("5a76b673-d57e-423e-92b0-e1375989bcb0", {
      kOSSettingsKeyInFocusDisplayOption: 2
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <ActionCableProvider cable={cable}>
          <Main />
        </ActionCableProvider>
      </ApolloProvider>
    );
  }
}

AppRegistry.registerComponent("cure8mobile", () => App);
