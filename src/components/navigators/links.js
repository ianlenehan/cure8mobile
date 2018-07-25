import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { primaryGreen } from '../../variables'
import Links from '../../screens/links'
import AddLink from '../../screens/addLink'
import Profile from '../../screens/profile'

export default StackNavigator({
  links: { screen: Links },
  addLink: { screen: AddLink },
  profile: { screen: Profile },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    tabBarLabel: 'Links',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="link" size={24} color={tintColor} />
    },
  },
})

// class LinksNav extends Component {
//   render() {
//     return linksNav
//   }
// }

// export default LinksNav
