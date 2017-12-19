import React, { Component } from 'react'
import { View, AsyncStorage, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Button, CheckBox, SearchBar } from 'react-native-elements'
import _ from 'lodash'
import {
  createLink,
  urlChanged,
  commentChanged,
  categoryChanged
} from '../redux/link/actions'
import ContactPickList from '../components/contactPickList'
import Input from '../components/common/input'

class AddLink extends Component {
  static navigationOptions = () => {
    return { title: 'Curate New Link' }
  }

  state = {
    saveToMyLinks: false,
    token: null,
    displayCheckBox: true,
    contacts: [],
    selectedContacts: [],
    enteredNumber: '',
  }

  async componentDidMount() {
    this.onUrlChange('')
    const token = await AsyncStorage.getItem('token')
    const { contacts, groups } = this.props
    this.setState({ token, contacts, groups })
    this.checkIfLinkExists()
  }

  onUrlChange = (url) => {
    this.props.urlChanged(url)
  }

  onCommentChange = (comment) => {
    this.props.commentChanged(comment)
  }

  async onContactPress(contactId) {
    if (this.state.selectedContacts.includes(contactId)) {
      const newState = this.state.selectedContacts.filter(contact => {
        return contact !== contactId
      })
      await this.setState({ selectedContacts: newState })
      return
    }
    this.setState({ selectedContacts: [...this.state.selectedContacts, contactId] })
  }

  checkIfLinkExists() {
    if (this.props.navigation.state.params) {
      const { url } = this.props.navigation.state.params
      if (url) {
        this.setState({ saveToMyLinks: false, displayCheckBox: false })
        this.props.urlChanged(url)
      }
    }
  }

  saveLink = () => {
    const { url, comment } = this.props
    const { saveToMyLinks, token, selectedContacts, enteredNumber } = this.state
    let contacts = selectedContacts
    if (enteredNumber.length) { contacts = [enteredNumber] }
    this.props.urlChanged('')
    this.props.commentChanged('')
    this.props.createLink({ url, comment, contacts, saveToMyLinks, token })
    this.props.navigation.goBack()
  }

  buttonStatus() {
    const { saveToMyLinks, selectedContacts, enteredNumber } = this.state
    const noContactSelected = saveToMyLinks === false && selectedContacts.length === 0
    const noNumberEntered =  enteredNumber.length < 8
    if (noContactSelected && noNumberEntered) {
      return true
    }
    return false
  }

  validateNumber(number) {
    if (number.length >+ 2 && number.split('')[0] !== '+') {
      Alert.alert(
        'Oops',
        "For anonymous number entries, please enter with a '+' followed by the country code, and drop the leading zero. For example, '+61551234567'."
      )
    } else {
      this.setState({ enteredNumber: number, contacts: [], groups: [] })
    }
  }

  contactSearch = (text) => {
    if (text.length >= 1 && !_.isNaN(Number(text))) {
      this.validateNumber(text)
    } else if (text.length >= 2) {
      const contacts = this.state.contacts.filter(contact => {
        return contact.name.includes(text)
      })
      this.setState({ contacts, groups: [] })
    } else {
      this.setState({ contacts: this.props.contacts, groups: this.props.groups, enteredNumber: '' })
    }
  }

  renderCheckBox() {
    const { saveToMyLinks, displayCheckBox } = this.state
    if (displayCheckBox) {
      return (
        <CheckBox
          title='Save to my links'
          center
          checked={saveToMyLinks}
          onPress={() => this.setState({ saveToMyLinks: !saveToMyLinks })}
          containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
        />
      )
    }
  }

  render() {
    const buttonDisabled = this.buttonStatus()
    return (
      <View style={styles.container}>
          <View style={styles.form}>
            <Input
              value={this.props.url}
              onChangeText={this.onUrlChange}
              placeholder='Link URL'
              autoCapitalize='none'
              returnKeyType={'done'}
            />
            <Input
              value={this.props.comment}
              onChangeText={this.onCommentChange}
              maxLength={140}
              placeholder='Comment'
              returnKeyType={'done'}
            />
          {this.renderCheckBox()}
          </View>
          <View style={{ flex: 3, marginTop: 0 }}>
            <SearchBar
              lightTheme
              placeholder='Search contacts or type number'
              containerStyle={{ backgroundColor: 'white', borderTopWidth: 0 }}
              inputStyle={{ backgroundColor: '#f3f3f3' }}
              clearIcon={{ color: '#86939e', name: 'clear' }}
              onChangeText={(text) => this.contactSearch(text)}
            />
            <ContactPickList
              contacts={this.state.contacts}
              selectedContacts={this.state.selectedContacts}
              groups={this.state.groups}
              onPress={this.onContactPress.bind(this)}
            />
            <View style={{ marginTop: 10 }}>
              <Button
                title='Curate'
                backgroundColor='#27ae60'
                onPress={this.saveLink}
                disabled={buttonDisabled}
              />
            </View>
          </View>
      </View>
    )
  }
}

const styles = {
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10
  },
  form: {
    flexDirection: 'column',
  },
  padding: {
    flex: 0.1
  },
}

const mapStateToProps = (state) => {
  const { url, comment, category } = state.link
  const { contacts, groups } = state.contact
  return { url, comment, category, contacts, groups }
}

export default connect(mapStateToProps, {
  urlChanged, commentChanged, categoryChanged, createLink,
})(AddLink)
