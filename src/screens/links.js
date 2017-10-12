import React, { Component } from 'react'
import {
  AsyncStorage,
  Text,
  View,
  TouchableHighlight,
  Image,
  StatusBar,
  Platform
} from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import OneSignal from 'react-native-onesignal'

import { getLinks } from '../redux/link/actions'
import { getUserInfo, updateUser } from '../redux/user/actions'
import { getContacts } from '../redux/contact/actions'
import LinkView from '../components/linkView'
import Spinner from '../components/common/spinner'

class Links extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation
    return {
      headerTitle: (
        <Image
          style={{ width: 100, height: 30 }}
          resizeMode='contain'
          source={require('../../assets/images/logo_clear.png')}
        />
      ),
      headerRight: (
        <Button
          icon={{ name: 'plus', type: 'font-awesome' }}
          iconRight
          backgroundColor='rgba(0,0,0,0)'
          onPress={() => navigate('addLink')}
        />
      ),
      headerLeft: (
        <Button
          icon={{ name: 'archive' }}
          iconLeft
          backgroundColor='rgba(0,0,0,0)'
          onPress={() => navigate('oldLinks')}
        />
      )
    }
  }

  componentDidMount() {
    this.getUserData()
    this.requestNotificationPermissions()

    OneSignal.getPermissionSubscriptionState((status) => {
      this.checkNotificationStatus(status)
    })

    this.showTour()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.authorized) this.props.navigation.navigate('auth')
    if (nextProps.userInfo.notifications && nextProps.userInfo.notifications.show_tour) {
      this.props.navigation.navigate('tour')
    }
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem('token')
    this.props.getLinks(token)
    this.props.getContacts(token)
    this.props.getUserInfo(token)
  }

  async showTour() {
    const tourShown = await AsyncStorage.getItem('tourShown')
    if (tourShown !== 'yes') {
      await AsyncStorage.setItem('tourShown', 'yes')
      this.props.navigation.navigate('tour')
    }
  }

  checkNotificationStatus = async (status) => {
    const pushToken = await AsyncStorage.getItem('pushToken')
    const token = await AsyncStorage.getItem('token')
    if (pushToken !== status.userId) {
      await AsyncStorage.setItem('pushToken', status.userId)
    }
    this.props.updateUser(token, status.userId, 'push')
    // TODO move this back into the if statement once I'm done fiddling
  }

  requestNotificationPermissions() {
    if (Platform.OS === 'ios') {
      const permissions = {
        alert: true,
        badge: true,
        sound: true
      }
      OneSignal.requestPermissions(permissions)
    }
  }

  renderLinkView() {
    const { loading, links } = this.props
    if (!links) {
      if (loading) {
        return (
          <View style={styles.loading}>
            <StatusBar barStyle="light-content" />
            <Spinner size='large' text='Loading links...' />
            <TouchableHighlight onPress={this.getuserData}>
              <Text style={styles.reload}>reload</Text>
            </TouchableHighlight>
          </View>
        )
      }
      return (
        <View style={styles.noLinks}>
          <Text>Looks like there are no new links!</Text>
        </View>
      )
    }
    return (
      <LinkView
        status='new'
        navigate={this.props.navigation.navigate}
        refresh={this.getUserData.bind(this)}
      />
    )
  }

  render() {
    return this.renderLinkView()
  }
}

const styles = {
  noLinks: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  reload: {
    margin: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'grey'
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
}

const mapStateToProps = ({ link, user }) => {
  const { links, loading, authorized } = link
  const { info: userInfo } = user
  return { links, loading, authorized, userInfo }
}

export default connect(mapStateToProps, { getLinks, getContacts, getUserInfo, updateUser })(Links)
