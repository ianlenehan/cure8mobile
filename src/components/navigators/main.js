import React, { Component } from 'react'
import { TabNavigator } from 'react-navigation'
import LinksNav from './links'
import ArchivedLinksNav from './archivedLinks'
import ChatsNav from './chats'
import ContactsNav from './contacts'
import ActivityNav from './activity'

import Welcome from '../../screens/welcome'
import Login from '../../screens/login'

const mainTabNavigator = TabNavigator({
  linksNavigator: { screen: LinksNav },
  oldLinks: { screen: ArchivedLinksNav },
  chats: { screen: ChatsNav },
  contacts: { screen: ContactsNav },
  activity: { screen: ActivityNav },
}, {
  tabBarOptions: {
    labelStyle: {
      fontSize: 8,
    },
  },
})

class Navigators extends Component {
  render() {
    const MainNavigator = TabNavigator({
      welcome: { screen: Welcome },
      auth: { screen: Login },
      main: { screen: mainTabNavigator },
    }, {
      navigationOptions: { tabBarVisible: false },
      lazy: true,
    })

    return <MainNavigator />
  }
}

export default Navigators
