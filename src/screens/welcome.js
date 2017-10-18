import React, { Component } from 'react'
import { AsyncStorage, View, Text, ActivityIndicator } from 'react-native'

class Welcome extends Component {
  state = { loading: true }
  async componentWillMount() {
    const token = await AsyncStorage.getItem('token')

    if (token) {
      this.setState({ loading: false })
      this.props.navigation.navigate('linksNavigator')
    } else {
      this.setState({ loading: false })
      this.props.navigation.navigate('auth')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color='white' />
      </View>
    )
  }
}

export default Welcome

const styles = {
  container: {
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    flex: 1
  },
  text: {
    fontSize: 36,
    color: '#fff',
    textAlign: 'center'

  }
}
