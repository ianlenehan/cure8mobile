import React, { Component } from 'react'
import {
  Text,
  View,
  AsyncStorage,
  Switch,
  Platform,
  Alert,
  NativeModules,
} from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { getUserInfo, updateUser } from '../redux/user/actions'
import { logUserOut } from '../redux/auth/actions'

const styles = {
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  details: {
    flex: 1,
  },
  button: {
    marginTop: 15,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  name: {
    textAlign: 'center',
    fontSize: 38,
    paddingTop: 30,
  },
  phone: {
    textAlign: 'center',
    color: 'grey',
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderColor: '#ddd',
    borderTopWidth: 1,
  },
  upgradeView: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
  },
  optionsView: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 5,
    elevation: 10,
  },
  options: {
    fontSize: 16,
    color: 'grey',
    paddingLeft: 5,
  },
  optionsTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  buyButton: {
    padding: 10,
    marginRight: -10,
  },
}

class Profile extends Component {
  static navigationOptions = () => {
    return {
      title: 'Settings',
    }
  }

  state = { token: null, readerMode: 'on', inAppPurchase: null, subscriptionType: null }

  componentDidMount() {
    this.loadInAppPurchaseProducts()
    this.setStateVariables()
  }

  async setStateVariables() {
    const token = await AsyncStorage.getItem('token')
    const readerModeFromStorage = await AsyncStorage.getItem('readerMode')
    const readerMode = readerModeFromStorage || 'on'
    const subscriptionType = this.props.info.subscription_type
    this.setState({ token, subscriptionType, readerMode })
    this.props.getUserInfo(token)
  }

  setReaderMode = async () => {
    const readerMode = this.state.readerMode === 'on' ? 'off' : 'on'
    await AsyncStorage.setItem('readerMode', readerMode)
    this.setState({ readerMode })
    this.props.getUserInfo(this.state.token)
  }

  deleteToken = async () => {
    const token = await AsyncStorage.getItem('token')
    await AsyncStorage.removeItem('token')
    this.props.logUserOut(token)
    this.props.navigation.navigate('auth')
  }

  toggleSwitch = (value, field) => {
    const { token } = this.state
    this.props.updateUser(token, value, field, this.props.info)
  }

  loadInAppPurchaseProducts() {
    if (Platform.OS === 'ios') {
      const productList = ['com.cure8.cure8app.premium']

      NativeModules.InAppUtils.loadProducts(productList, (error, products) => {
        if (products && products.length) {
          this.setState({ inAppPurchase: products[0] })
        }
      })
    }
  }

  _restorePurchase = () => {
    const { token } = this.state
    NativeModules.InAppUtils.restorePurchases((error, response) => {
      if (error) {
        Alert.alert('iTunes Error', 'Could not connect to iTunes store.')
      } else {
        Alert.alert('Restore Successful', 'Successfully restores all your purchases.')

        if (response.length === 0) {
          Alert.alert('No Purchases', "We didn't find any purchases to restore.")
          return
        }

        response.forEach(async (purchase) => {
          if (purchase.productIdentifier === 'com.cure8.cure8app.premium') {
            await this.props.updateUser(token, 'unlimited', 'subscription_type', this.props.info)
            this.setState({ subscriptionType: 'unlimited' })
            AsyncStorage.setItem('subscriptionType', 'unlimited')
            await AsyncStorage.removeItem('limitReached')
            this.props.getUserInfo(this.state.token)
          }
        })
      }
    })
  }

  upgradeHelp = () => {
    Alert.alert(
      'Why purchase the full version?',
      'The free version of this app allows you to create and receive five curations. The full version removes these restrictions. Press "Restore" if you have already upgraded the app.',
      [
        { text: 'OK' },
        { text: 'Restore', onPress: this._restorePurchase() },
      ],
    )
  }

  upgradeSubscription = () => {
    const { identifier } = this.state.inAppPurchase
    NativeModules.InAppUtils.purchaseProduct(identifier, async (error, response) => {
      if (response && response.productIdentifier) {
        this.setState({ subscriptionType: 'unlimited' })
        AsyncStorage.setItem('subscriptionType', 'unlimited')
        Alert.alert('Purchase Successful', `Your Transaction ID is ${response.transactionIdentifier}`)
        await this.props.updateUser(this.state.token, 'unlimited', 'subscription_type', this.props.info)
        await AsyncStorage.removeItem('limitReached')
      }
    })
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
            tintColor="#dcdcdc"
            onTintColor="#27ae60"
            value={switchPos}
            onValueChange={this.setReaderMode}
          />
        </View>
      )
    }
    return null
  }

  renderUpgradeButton() {
    const { inAppPurchase, subscriptionType } = this.state
    const isIOS = Platform.OS === 'ios'
    if (inAppPurchase && !subscriptionType && isIOS) {
      return (
        <View style={[styles.upgradeView, styles.switchView]}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.options}>Purchase full version</Text>
            <Icon
              name="question-circle"
              type="font-awesome"
              size={18}
              color="#27ae60"
              containerStyle={{ paddingLeft: 10 }}
              onPress={this.upgradeHelp}
            />
          </View>
          <Button
            title={this.state.inAppPurchase.priceString}
            fontSize={12}
            backgroundColor="#27ae60"
            buttonStyle={styles.buyButton}
            borderRadius={5}
            onPress={this.upgradeSubscription}
          />
        </View>
      )
    }
    return null
  }

  renderOptions() {
    if (this.props.info.notifications) {
      const { push, rating, curation } = this.props.info.notifications
      return (
        <View style={styles.optionsView}>
          {this.readerMode()}
          <View style={styles.switchView}>
            <Text style={styles.options}>Push Notifications</Text>
            <Switch
              tintColor="#dcdcdc"
              onTintColor="#27ae60"
              value={push}
              onValueChange={(val) => this.toggleSwitch(val, 'notifications')}
            />
          </View>
          <View style={styles.switchView}>
            <Text style={styles.options}>Rating Notifications</Text>
            <Switch
              tintColor="#dcdcdc"
              onTintColor="#27ae60"
              value={push ? rating : push}
              onValueChange={(val) => this.toggleSwitch(val, 'getRatingNotifications')}
            />
          </View>
          <View style={[styles.switchView, { borderBottomWidth: 1 }]}>
            <Text style={styles.options}>New Curation Notifications</Text>
            <Switch
              tintColor="#dcdcdc"
              onTintColor="#27ae60"
              value={push ? curation : push}
              onValueChange={(val) => this.toggleSwitch(val, 'getCurationNotifications')}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={this.deleteToken}
              title="Log out"
              backgroundColor="#27ae60"
              color="#fff"
            />
          </View>
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.details}>
          <Text style={styles.name}>{this.props.info.name}</Text>
          <Text style={styles.phone}>{this.props.info.phone}</Text>
        </View>
        <View>
          {this.renderUpgradeButton()}
          {this.renderOptions()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => {
  const { info } = user
  return { info }
}

export default connect(mapStateToProps, {
  getUserInfo,
  updateUser,
  logUserOut,
})(Profile)
