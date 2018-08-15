import React from 'react'
import { StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { primaryGreen } from '../../variables'
import Chats from '../../screens/chats'
import Chat from '../../screens/chat'

export default StackNavigator({
  chats: { screen: Chats },
  chat: { screen: Chat },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    headerTitle: 'Chats',
    tabBarLabel: 'Chats',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="comments" type="font-awesome" size={24} color={tintColor} />
    },
  },
})
