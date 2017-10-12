import React, { Component } from 'react'
import { Text, View, AsyncStorage, Switch, Platform } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { getUserInfo, updateUser } from '../redux/user/actions'
import { logUserOut } from '../redux/auth/actions'

class Profile extends Component {
  static navigationOptions = () => {
    return {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="user" type="font-awesome" size={24} color={tintColor} />;
      }
    }
  }

  state = { token: null , readerMode: 'on' }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    let readerMode = await AsyncStorage.getItem('readerMode')
    this.setState({ token, readerMode: readerMode || 'on' })
  }

  deleteToken = async () => {
    const token = await AsyncStorage.getItem('token')
    await AsyncStorage.removeItem('token')
    this.props.logUserOut(token)
    this.props.navigation.navigate('auth')
    console.log('Token Deleted')
  }

  toggleSwitch = (value, field) => {
    const { token } = this.state
    this.props.updateUser(token, value, field, this.props.info)
  }

  setReaderMode = async () => {
    const readerMode = this.state.readerMode === 'on' ? 'off' : 'on'
    await AsyncStorage.setItem('readerMode', readerMode)
    this.setState({ readerMode })
    this.props.getUserInfo(this.state.token)
  }

  renderStats() {
    const { stats } = this.props.info
    if (stats) {
      return (
        <View style={styles.stats}>
          <Text style={styles.stat}>Curations: {stats.curations}</Text>
          <Text style={styles.stat}>Score: {stats.score * 100}%</Text>
        </View>
      )
    }
  }

  readerMode() {
    let switchPos = true
    if (this.state.readerMode === 'off') {
      switchPos = false
    }
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.switchView}>
          <Text style={styles.options}>Default Safari to Reader Mode</Text>
          <Switch
            tintColor='#dcdcdc'
            onTintColor='#27ae60'
            value={switchPos}
            onValueChange={this.setReaderMode}
          />
        </View>
      )
    }
  }

  renderOptions() {
    const { push, rating, curation } = this.props.info.notifications
    return (
      <View style={styles.optionsView}>
        {this.readerMode()}
        <View style={styles.switchView}>
          <Text style={styles.options}>Push Notifications</Text>
          <Switch
            tintColor='#dcdcdc'
            onTintColor='#27ae60'
            value={push}
            onValueChange={(val) => this.toggleSwitch(val, 'notifications')}
          />
        </View>
        <View style={styles.switchView}>
          <Text style={styles.options}>Rating Notifications</Text>
          <Switch
            tintColor='#dcdcdc'
            onTintColor='#27ae60'
            value={push ? rating : push}
            onValueChange={(val) => this.toggleSwitch(val, 'getRatingNotifications')}
          />
        </View>
        <View style={styles.switchView}>
          <Text style={styles.options}>New Curation Notifications</Text>
          <Switch
            tintColor='#dcdcdc'
            onTintColor='#27ae60'
            value={push ? curation : push}
            onValueChange={(val) => this.toggleSwitch(val, 'getCurationNotifications')}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={this.deleteToken}
            title="Log out"
            backgroundColor='#27ae60'
            color='#fff'
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.details}>
          <Text style={styles.name}>{this.props.info.name}</Text>
          <Text style={styles.phone}>{this.props.info.phone}</Text>
          {this.renderStats()}
          {this.renderOptions()}
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#27ae60',
    paddingTop: 10,
    paddingBottom: 10
  },
  details: {
    flex: 1
  },
  button: {
    marginTop: 15,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20
  },
  name: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 48,
    paddingTop: 30
  },
  phone: {
    color: '#fff',
    textAlign: 'center'
  },
  stats: {
    marginTop: 30,
    justifyContent: 'center',
    flex: 1
  },
  stat: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 24
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionsView: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 5,
    elevation: 10
  },
  options: {
    fontSize: 16,
    color: 'grey',
    paddingLeft: 5
  },
  optionsTitle: {
    fontSize: 20,
    textAlign: 'center',
  }
}

const mapStateToProps = ({ user }) => {
  const { info } = user
  return { info }
}

export default connect(mapStateToProps, { getUserInfo, updateUser, logUserOut })(Profile)
