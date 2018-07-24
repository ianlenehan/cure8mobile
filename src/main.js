import React, { Component } from 'react'
import { AppState, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { TabNavigator, StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { Root } from 'native-base'
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
import Activity from './screens/activity'
import Chats from './screens/chats'
import Chat from './screens/chat'

const contactsNavigator = StackNavigator({
  myContacts: { screen: Contacts },
  contactSearch: { screen: ContactSearch },
  addContact: { screen: AddContact },
  myGroups: { screen: Groups },
  newGroup: { screen: NewGroup },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    tabBarLabel: 'Contacts',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="address-book-o" type="font-awesome" size={24} color={tintColor} />
    },
  },
})

const linksNavigator = StackNavigator({
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

const activityNav = StackNavigator({
  activity: { screen: Activity },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  },
})

const oldLinksNav = StackNavigator({
  oldLinks: { screen: OldLinks },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  },
})

const chatsNav = StackNavigator({
  chats: { screen: Chats },
  chat: { screen: Chat },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  },
})

const mainTabNavigator = TabNavigator({
  linksNavigator: { screen: linksNavigator },
  oldLinks: { screen: oldLinksNav },
  chats: { screen: chatsNav },
  contacts: { screen: contactsNavigator },
  activity: { screen: activityNav },
}, {
  tabBarOptions: {
    labelStyle: {
      fontSize: 8,
    },
  },
})

class App extends Component {
  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const token = await AsyncStorage.getItem('token')
      console.log('App has come to the foreground!')
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    const MainNavigator = TabNavigator({
      welcome: { screen: Welcome },
      auth: { screen: Login },
      main: { screen: mainTabNavigator },
    }, {
      navigationOptions: { tabBarVisible: false },
      lazy: false,
    })

    return (
      <Root>
        <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <MainNavigator />
        </Provider>
      </Root>
    )
  }
}

export default App
