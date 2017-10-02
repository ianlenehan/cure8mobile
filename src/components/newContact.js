import React, { Component } from 'react'
import {
  AsyncStorage,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation
} from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import Contacts from 'react-native-contacts'
import ContactRow from '../components/contactRow'
import Spinner from '../components/common/spinner'
import Input from '../components/common/input'
import { nameChanged } from '../redux/contact/actions'

class NewContact extends Component {
  state = { searchMode: false, contacts: [] }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
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
    this.setState({ searchMode: !this.state.searchMode })
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
    console.log('render names', this.state.contacts);
    return this.state.contacts.map(contact => {
      return (
        <TouchableOpacity key={contact.recordID}>
          <Text>{`${contact.givenName} ${contact.familyName}`}</Text>
        </TouchableOpacity>
      )
    })
  }

  renderContent() {
    if (this.state.searchMode) {
      return (
        <View>
          {this.renderNames()}
          <Input
            placeholder={'Contact name'}
            value={this.props.name}
            onChangeText={this.contactNameChanged}
            returnKeyType={'done'}
            disableReturnKey={false}
          />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        <Button
          icon={{ name: 'plus', type: 'font-awesome' }}
          title='New Contact'
          backgroundColor='#27ae60'
          onPress={this.onButtonPress}
          buttonStyle={styles.button}
        />
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
    marginTop: 10
  },
  button: {
    margin: 10
  }
}

const mapStateToProps = ({ contact }) => {
  const { name } = contact
  return { name }
}

export default connect(mapStateToProps, { nameChanged })(NewContact)
