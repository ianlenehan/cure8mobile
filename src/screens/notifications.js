import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import { Icon, Button } from 'react-native-elements'

export default class Notifications extends Component {
  static navigationOptions = () => {
    return {
      tabBarLabel: 'Notifications',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="bell-o" type="font-awesome" size={24} color={tintColor} />;
      }
    }
  }
  render() {
    return (
      <View>
        <Text>Notifications Screen</Text>
        <Text>Notifications Screen</Text>
        <Text>Notifications Screen</Text>
        <Text>Notifications Screen</Text>
        <Text>Notifications Screen</Text>
        <Text>Notifications Screen</Text>
      </View>
    )
  }
}
