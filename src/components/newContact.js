import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  ScrollView,
  Alert,
} from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import Contacts from 'react-native-contacts'
import Input from '../components/common/input'
import { nameChanged } from '../redux/contact/actions'

const styles = {
  searchContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    paddingTop: 5,
  },
  button: {
    margin: 10,
  },
  name: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
}

class NewContact extends Component {
  state = { searchMode: false, contacts: [] }

  onButtonPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      searchMode: !this.state.searchMode,
      contacts: [],
    })
    this.props.nameChanged('')
  }

  onContactPress = (contact) => {
    const { navigate, key } = this.props
    navigate('addContact', { contact, key })
  }

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
      if (permission === 'undefined') {
        Contacts.requestPermission((error, perm) => {
          console.log('contacts request', error, perm)
        })
      }
      if (permission === 'authorized') {
        this.getPhoneContact()
      }
      if (permission === 'denied') {
        Alert.alert('Contacts Permission', 'You have not granted Cure8 access to your address book. Please enable this in your settings to add your contacts.')
      }
    })
  }

  contactNameChanged = (text) => {
    this.props.nameChanged(text)
    if (text.length > 2) {
      this.getPhonePermissions()
    } else {
      this.setState({ contacts: [] })
    }
  }

  renderNames() {
    return this.state.contacts.map(contact => {
      const name = `${contact.givenName || ''} ${contact.familyName || ''}`
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
            placeholder="Type a name"
            value={this.props.name}
            onChangeText={this.contactNameChanged}
            returnKeyType="done"
            disableReturnKey={false}
          />
          <Button
            icon={{ name: 'chevron-down', type: 'font-awesome' }}
            backgroundColor="#27ae60"
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
        title="New Contact"
        backgroundColor="#27ae60"
        onPress={this.onButtonPress}
        buttonStyle={styles.button}
      />
    )
  }

  render() {
    return (
      <View style={styles.searchContainer}>
        {this.renderButton()}
      </View>
    )
  }
}

const mapStateToProps = ({ contact }) => {
  const { name } = contact
  return { name }
}

export default connect(mapStateToProps, { nameChanged })(NewContact)
