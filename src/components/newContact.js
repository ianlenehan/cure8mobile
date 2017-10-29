import React, { Component } from 'react'
import {
  AsyncStorage,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  ScrollView
} from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import Contacts from 'react-native-contacts'
import ContactRow from '../components/contactRow'
import Spinner from '../components/common/spinner'
import Input from '../components/common/input'
import Title from '../components/common/title'
import { nameChanged } from '../redux/contact/actions'

class NewContact extends Component {
  state = { searchMode: false, contacts: [] }

  getPhoneContact() {
    Contacts.getContactsMatchingString(this.props.name, (err, contacts) => {
      if (err === 'denied') {
        console.log('oops denied');
      } else {
        this.setState({ contacts })
      }
    })
  }

  getPhonePermissions() {
    // Keyboard.dismiss()
    Contacts.checkPermission((err, permission) => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if (permission === 'undefined') {
        Contacts.requestPermission((err, permission) => {
          console.log('permission is? ', permission)
        })
      }
      if (permission === 'authorized') {
        console.log('permission authorized')
        this.getPhoneContact()
      }
      if (permission === 'denied') {
        console.log('permission denied')
      }
    })
  }

  onButtonPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      searchMode: !this.state.searchMode,
      contacts: []
    })
    this.props.nameChanged('')
  }

  contactNameChanged = (text) => {
    this.props.nameChanged(text)
    if (text.length > 2) {
      this.getPhonePermissions()
    } else {
      this.setState({ contacts: [] })
    }
  }

  onContactPress = (contact) => {
    const { navigate, key } = this.props
    console.log('contact', contact);
    navigate('addContact', { contact, key })
  }

  renderNames() {
    return this.state.contacts.map(contact => {
      const name = `${contact.givenName} ${contact.familyName}`
      return (
        <TouchableOpacity
          key={contact.recordID}
          onPress={() => this.onContactPress(contact)}
        >
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
      )
    })
  }

  renderButton() {
    if (this.state.searchMode) {
      return (
        <View style={{ height: 250 }}>
          <Input
            placeholder={'Type a name'}
            value={this.props.name}
            onChangeText={this.contactNameChanged}
            returnKeyType={'done'}
            disableReturnKey={false}
            />
          <Button
            icon={{ name: 'chevron-down', type: 'font-awesome' }}
            backgroundColor='#27ae60'
            onPress={this.onButtonPress}
            buttonStyle={styles.button}
            />
          <ScrollView>
            {this.renderNames()}
          </ScrollView>
        </View>
      )
    }
    return (
      <Button
        icon={{ name: 'plus', type: 'font-awesome' }}
        title='New Contact'
        backgroundColor='#27ae60'
        onPress={this.onButtonPress}
        buttonStyle={styles.button}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderButton()}
      </View>
    )
  }
}

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
    paddingTop: 5
  },
  button: {
    margin: 10
  },
  name: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold'
  }
}

const mapStateToProps = ({ contact }) => {
  const { name } = contact
  return { name }
}

export default connect(mapStateToProps, { nameChanged })(NewContact)
