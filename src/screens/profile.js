import React, { Component } from 'react'
import {
  Text,
  View,
  AsyncStorage,
  Switch,
  Platform,
  Alert,
  NativeModules
} from 'react-native'
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

  state = { token: null , readerMode: 'on', inAppPurchase: null, membership: null }

  async componentDidMount() {
    this.loadInAppPurchaseProducts()
    const token = await AsyncStorage.getItem('token')
    const readerMode = await AsyncStorage.getItem('readerMode')
    const membership = await AsyncStorage.getItem('membership')
    this.setState({ token, membership, readerMode: readerMode || 'on' })
  }

  loadInAppPurchaseProducts() {
    const productList = ['com.cure8.cure8app.premium']

    NativeModules.InAppUtils.loadProducts(productList, (error, products) => {
      if (products.length) {
        this.setState({ inAppPurchase: products[0] })
      }
    });
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

  statsAlert = () => {
    Alert.alert(
      'What is this?',
      'This number is calculated as the percentage of curations your friends have rated with a thumbs up.'
    )
  }

  upgradeHelp = () => {
    Alert.alert(
      'What is Premium Membership?',
      'The free version of this app allows you to create and receive five curations. Premium Membership removes these restrictions.'
    )
  }

  upgradeMembership = () => {
    const { identifier } = this.state.inAppPurchase
    NativeModules.InAppUtils.purchaseProduct(identifier, async (error, response) => {
      if(response && response.productIdentifier) {
        Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
        await AsyncStorage.setItem('membership', 'premium')
        this.props.getUserInfo(this.state.token)
      }
    })
  }

  renderStats() {
    const { stats } = this.props.info
    if (stats) {
      return (
        <View style={styles.stats}>
          <Text style={styles.stat}>Curations: {stats.curations}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.stat}>Score: {stats.score * 100}%</Text>
            <Icon
              name='question-circle'
              type='font-awesome'
              size={18}
              color='white'
              containerStyle={{ paddingLeft: 5 }}
              onPress={this.statsAlert}
            />
            </View>
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

  renderUpgradeButton() {
    const { inAppPurchase, membership } = this.state
    if (inAppPurchase && !membership) {
      return (
        <View style={[styles.upgradeView, styles.switchView]}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.options}>Upgrade membership</Text>
            <Icon
              name='question-circle'
              type='font-awesome'
              size={18}
              color='#27ae60'
              containerStyle={{ paddingLeft: 10 }}
              onPress={this.upgradeHelp}
              />
          </View>
          <Button
            title={this.state.inAppPurchase.priceString}
            fontSize={12}
            backgroundColor='#27ae60'
            buttonStyle={styles.buyButton}
            borderRadius={5}
            onPress={this.upgradeMembership}
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
          {this.renderUpgradeButton()}
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
  upgradeView: {
    backgroundColor: '#fff',
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
  },
  buyButton: {
    padding: 10,
    marginRight: -10
  }
}

const mapStateToProps = ({ user }) => {
  const { info } = user
  return { info }
}

export default connect(mapStateToProps, { getUserInfo, updateUser, logUserOut })(Profile)
