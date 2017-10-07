import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  LayoutAnimation,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { Button, Icon } from 'react-native-elements'

import {
  phoneChanged,
  codeChanged,
  logUserIn,
  createAccount,
  getTemporaryCode,
  firstNameChanged,
  lastNameChanged,
  resetPhoneNumber
}  from '../redux/auth/actions'
import {
  pickerChanged,
  getUserLocation,
} from '../redux/picker/actions'
import PhonePicker from '../components/phonePicker'
import Input from '../components/common/input'

class Login extends Component {

  componentDidMount() {
    this.props.getUserLocation()
    this.onAuthComplete(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.onAuthComplete(nextProps)
  }

  onAuthComplete(props) {
    if (props.token) {
      this.props.navigation.navigate('linksNavigator')
    }
  }

  onFirstNameChange = (text) => {
    this.props.firstNameChanged(text)
  }

  onLastNameChange = (text) => {
    this.props.lastNameChanged(text)
  }

  onPhoneChange = (phone) => {
    this.props.phoneChanged(phone, this.props.callingCode)
  }

  onCodeChange = (code) => {
    this.props.codeChanged(code)
  }

  onPickerChange = (countryName, callingCode) => {
    this.props.pickerChanged(countryName, callingCode)
    this.props.phoneChanged(this.props.phone, callingCode)
  }

  onLoginPress = () => {
    Keyboard.dismiss()
    const { formattedPhone, code } = this.props
    if (this.props.buttonText === 'Create Account') {
      const { firstName, lastName } = this.props
      this.props.createAccount({ formattedPhone, code, firstName, lastName })
    } else {
      this.props.logUserIn({ formattedPhone, code })
    }
  }

  onGetCodePress = () => {
    Keyboard.dismiss()
    this.props.getTemporaryCode(this.props.formattedPhone)
  }

  onFixPhonePress = () => {
    Keyboard.dismiss()
    this.props.resetPhoneNumber()
  }

  loginOrCreateAccount(text) {
    if (text === 'Create Account') {
      return (
        <View>
          <Input
            value={this.props.firstName}
            onChangeText={this.onFirstNameChange}
            placeholder='First name'
            green
          />
          <Input
            value={this.props.lastName}
            onChangeText={this.onLastNameChange}
            placeholder='Last name'
            green
          />
        </View>
      )
    }
  }

  buttonText() {
    const { loading, formattedPhone, phone } = this.props
    let prefix = 'Get code'
    if (loading) { prefix = 'Generating code' }
    if (phone !== '') {
      return `${prefix} for ${formattedPhone}`
    }
    return prefix
  }

  renderPicker() {
    if (this.props.countryName) {
      return (
        <PhonePicker
          countryName={this.props.countryName}
          onCountryChange={this.onPickerChange}
          style={styles.picker}
          itemStyle={{ color: '#fff' }}
        />
      )
    }
  }

  renderPhoneInput() {
    if (this.props.buttonText) {
      return (
        <Input
          value={this.props.formattedPhone}
          editable={false}
          green
        />
      )
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <Input
          value={this.props.phone}
          onChangeText={this.onPhoneChange}
          keyboardType={'phone-pad'}
          placeholder='Phone number'
          style={{ flex: 1 }}
          green
          onBlur={() => Keyboard.dismiss()}
        />
        <Icon
          containerStyle={{ marginLeft: -17, marginRight: 3, marginTop: 3 }}
          name='keyboard-hide'
          color="#fff"
          onPress={() => Keyboard.dismiss()}
          underlayColor='rgba(0,0,0,0)'
        />
      </View>
    )
  }

  renderFormButton() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.props.buttonText) {
      return (
        <View>
          <Input
            value={this.props.code}
            onChangeText={this.onCodeChange}
            keyboardType={'phone-pad'}
            placeholder='Code sent via SMS'
            secureTextEntry
            green
          />
        {this.loginOrCreateAccount(this.props.buttonText)}

          <Button
            title={this.props.buttonText}
            backgroundColor='#fff'
            color='#27ae60'
            buttonStyle={styles.button}
            onPress={this.onLoginPress}
          />
        <TouchableOpacity onPress={this.onGetCodePress}>
          <Text style={styles.resendPwd}>Send new code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onFixPhonePress}>
          <Text style={styles.resendPwd}>Re-enter phone number</Text>
        </TouchableOpacity>
        </View>
      )
    }
    return (
      <View>
        <Text style={styles.instructions}>
          Enter your number to sign in or create account.
          Choose your country code from the list below.
          You will receive a single use code via SMS once you tap on "Get code".
          Enter that code on the next screen to proceed.
        </Text>
        {this.renderPicker()}
        <Text style={styles.error}>{this.props.error}</Text>
        <Button
          title={this.buttonText()}
          disabled={this.props.loading}
          backgroundColor='#fff'
          color='#27ae60'
          buttonStyle={styles.button}
          onPress={this.onGetCodePress}
        />
      </View>
    )
  }

  render() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    return (
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.container}
      >
        <Text style={styles.header}>cure8</Text>
        <StatusBar hidden />
          <View style={styles.form}>
            {this.renderPhoneInput()}
            {this.renderFormButton()}
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    flex: 1
  },
  header: {
    color: '#fff',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    flex: 1
  },
  instructions: {
    marginBottom: 30,
    marginTop: 2,
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginLeft: 22,
    marginRight: 22
  },
  button: {
    marginTop: 15,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20
  },
  label: {
    color: '#fff',
  },
  form: {
    justifyContent: 'flex-start',
    flex: 8,
  },
  picker: {
    backgroundColor: Platform.OS === 'ios' ? '#219452' : 'rgba(33,148,82,0.4)',
  },
  error: {
    color: 'white',
    textAlign: 'center',
    margin: 5
  },
  resendPwd: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
}

const mapStateToProps = (state) => {
  const {
    phone,
    code,
    firstName,
    lastName,
    token,
    buttonText,
    formattedPhone,
    error,
    loading
  } = state.auth
  const { countryName, callingCode } = state.picker
  return {
    phone,
    firstName,
    lastName,
    code,
    token,
    buttonText,
    countryName,
    callingCode,
    formattedPhone,
    error,
    loading
  }
}

export default connect(mapStateToProps, {
  phoneChanged,
  codeChanged,
  pickerChanged,
  getUserLocation,
  logUserIn,
  createAccount,
  getTemporaryCode,
  firstNameChanged,
  lastNameChanged,
  resetPhoneNumber
})(Login)
