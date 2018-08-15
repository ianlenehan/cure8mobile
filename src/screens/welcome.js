import React, { Component } from 'react'
import { AsyncStorage, View, ActivityIndicator } from 'react-native'
import DefaultPreference from 'react-native-default-preference'

const styles = {
  container: {
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
  },
}

class Welcome extends Component {
  async componentWillMount() {
    const token = await AsyncStorage.getItem('token')

    if (token) {
      DefaultPreference.setName('group.cure8.cure8app')
      await DefaultPreference.set('authToken', token)
      this.props.navigation.navigate('linksNavigator')
    } else {
      this.props.navigation.navigate('auth')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }
}

export default Welcome
