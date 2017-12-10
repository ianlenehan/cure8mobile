import React, { Component } from 'react'
import { AsyncStorage, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import axios from 'axios'
import H1 from '../components/common/H1'
import PhonePicker from '../components/phonePicker'

import { saveContact, getContacts } from '../redux/contact/actions'

class AddContact extends Component {
  static navigationOptions = ({ navigation }) => {
    const { familyName, givenName } = navigation.state.params.contact
    return {
      title: `${givenName || ''} ${familyName || ''}`,
    }
  }

  state = { callingCode: '', countryName: null, token: '' }

  async componentDidMount() {
    this.getUserLocation()
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  onAddPress = async (name, number) => {
    const { key } = this.props.navigation.state.params
    const cleanNumber = this.formatNumber(number)

    this.props.saveContact(name, cleanNumber, this.state.token)
    this.props.navigation.goBack(key)
  }

  getUserLocation() {
    const url = 'https://freegeoip.net/json/'
    axios.get(url)
      .then((res) => {
        this.setState({
          countryName: res.data.country_name
        })
      })
      .catch((error) => {
       console.error(error)
     })
  }

  getDetailsFromPicker(countryName, callingCode) {
    this.setState({ countryName, callingCode })
  }

  numberLabel = (label) => {
    return label || 'phone'
  }

  formatNumber(number) {
    const fullNumber = number.split('')[0] === '+'
    const { callingCode } = this.state
    const numbersOnly = Number(number.replace(/[^\d]/g, ''))
    if (fullNumber) {
      const n = `${this.removeParenthesesFromFull(number)}`
      return `+${Number(n.replace(/[^\d]/g, ''))}`
    }
    return `+${callingCode}${numbersOnly}`
  }

  removeParenthesesFromFull(number) {
    return number.replace(/\(0\)/g, '').replace(/ /g, '')
  }

  renderPicker() {
    const note = 'Country code selected below only applies if ' +
      'the phone number chosen does not begin with +'
    if (this.state.countryName) {
      return (
        <PhonePicker
          countryName={this.state.countryName}
          onCountryChange={this.getDetailsFromPicker.bind(this)}
          note={note}
          green
        />
      )
    }
  }

  render() {
    const { phoneNumbers: numbers, givenName, familyName } = this.props.navigation.state.params.contact
    const name = `${givenName} ${familyName}`
    return (
      <View>
        <H1 text={'Select a Number'} />
        {this.renderPicker()}
        <ScrollView>
          <List containerStyle={{ marginBottom: 20 }}>
            {
              numbers.map((number, i) => (
                <ListItem
                  key={i}
                  title={number.number}
                  subtitle={this.numberLabel(number.label)}
                  rightIcon={{ name: 'plus', type: 'font-awesome' }}
                  onPress={() => this.onAddPress(name, number.number)}
                />
              ))
            }
          </List>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = ({ contact }) => {
  const { contacts } = contact
  return { contacts }
}

export default connect(mapStateToProps, { saveContact, getContacts })(AddContact)
