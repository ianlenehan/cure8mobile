import React, { Component } from 'react'
import { TabNavigator, StackNavigator } from 'react-navigation'
import { Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './redux/reducers'
import { primaryGreen } from './variables'
import Contacts from './screens/contacts'
import Welcome from './screens/welcome'
import Login from './screens/login'
import Links from './screens/links'
import AddLink from './screens/addLink'
import OldLinks from './screens/oldLinks'
import Profile from './screens/profile'
import ContactSearch from './screens/contactSearch'
import Groups from './screens/groups'
import NewGroup from './screens/newGroup'
import AddContact from './screens/addContact'
import Tour from './screens/tour'
import Activity from './screens/activity'

const contactsNavigator = StackNavigator({
  myContacts: { screen: Contacts },
  contactSearch: { screen: ContactSearch },
  addContact: { screen: AddContact },
  myGroups: { screen: Groups },
  newGroup: { screen: NewGroup }
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    tabBarLabel: 'Contacts',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="address-book-o" type="font-awesome" size={24} color={tintColor} />
    }
  }
})

const linksNavigator = StackNavigator({
  links: { screen: Links },
  addLink: { screen: AddLink },
  oldLinks: { screen: OldLinks },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    tabBarLabel: 'Links',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="link" size={24} color={tintColor} />
    }
  }
})

const activityNav = StackNavigator({
  activity: { screen: Activity },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  }
})

const mainTabNavigator = TabNavigator({
  linksNavigator: { screen: linksNavigator },
  contacts: { screen: contactsNavigator },
  activity: { screen: activityNav },
  profile: { screen: Profile }
}, {
  tabBarOptions: {
    labelStyle: {
      fontSize: 8,
    }
  },
  lazy: true
})

// const cacheImages = (images) => {
//   return images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     }
//     return Expo.Asset.fromModule(image).downloadAsync();
//   })
// }

export default class App extends Component {
  // componentWillMount() {
  //   this.loadAssetsAsync()
  // }

  // async loadAssetsAsync() {
  //   const imageAssets = cacheImages([
  //     require('./assets/images/tour_1.png'),
  //     require('./assets/images/tour_2.png'),
  //     require('./assets/images/tour_3.png'),
  //     require('./assets/images/tour_4.png'),
  //     require('./assets/images/tour_5.png')
  //   ])
  //
  //   await Promise.all([
  //     ...imageAssets,
  //   ]);
  // }

  render() {
    const MainNavigator = TabNavigator({
      welcome: { screen: Welcome },
      auth: { screen: Login },
      main: { screen: mainTabNavigator },
      tour: { screen: Tour }
    }, {
      navigationOptions: { tabBarVisible: false },
      lazy: true
    })

    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <MainNavigator />
      </Provider>
    )
  }
}
