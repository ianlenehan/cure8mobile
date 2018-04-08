import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import Contacts from 'react-native-contacts'
import { connect } from 'react-redux'
import _ from 'lodash'

import ContactRow from '../components/contactRow'
import Input from '../components/common/input'
import { nameChanged } from '../redux/contact/actions'

class ContactSearch extends Component {
  static navigationOptions = () => {
    return {
      title: 'Address Book'
    }
  }

  state = { loading: true, total: 0, hasNextPage: null, contacts: [], filteredContacts: [] }

  componentDidMount() {
    this.props.nameChanged('')
    this.getPhoneContacts()
  }

  componentWillReceiveProps() {
    // this.filterContacts()
  }

  onContactPress = (contact) => {
    const { navigate, state } = this.props.navigation
    navigate('addContact', { contact, key: state.key })
  }

  async getPhoneContacts() {
    Keyboard.dismiss()
    let status
    Contacts.checkPermission((err, permission) => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if (permission === 'undefined') {
        Contacts.requestPermission((err, permission) => {
          console.log('permission is? ', permission)
          status = permission
        })
      }
      if (permission === 'authorized') {
        console.log('permission authorized')
        Contacts.getAll((err, contacts) => {
          console.log('getting contacts');
          if(err === 'denied'){
            console.log("hmm you've been denied contacts access");
          } else {
            console.log('contacts', contacts);
          }
        })
      }
      if (permission === 'denied') {
        console.log('permission denied')
        status = permission
      }
    })
    if (status === 'authorized') {

      // const { data, total, hasNextPage } = contacts
      // const cleanContacts = data.filter(contact => {
      //   return contact.name && contact.phoneNumbers.length
      // })
      // const sortedContacts = _.sortBy(cleanContacts, user => user.name)
      // this.setState({
      //   contacts: sortedContacts,
      //   total,
      //   hasNextPage,
      //   filteredContacts: sortedContacts
      // })
      // this.filterContacts()
    }
  }

  filterContacts() {
    if (this.props.name.length >= 2) {
      const contacts = this.state.contacts.filter(contact => {
        return contact.name.includes(this.props.name)
      })
      this.setState({ filteredContacts: contacts })
    } else {
      this.setState({ filteredContacts: this.state.contacts })
    }
  }

  showMoreButton() {
    const { hasNextPage, total, contacts } = this.state
    if (hasNextPage) {
      const moreToLoad = Math.ceil(total / 4)
      const nextPage = contacts.length + moreToLoad
      return (
        <View style={styles.loadButtons}>
          <TouchableOpacity onPress={() => this.getPhoneContacts(nextPage)}>
            <Text style={styles.loadButton}>load more</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.getPhoneContacts(total)}>
            <Text style={styles.loadButton}>load all</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  inputPlaceholder() {
    if (this.state.hasNextPage) {
      return `Search ${this.state.contacts.length} of ${this.state.total} contacts`
    }
    return 'Search all contacts'
  }

  renderItem({ item }) {
    return (
      <ContactRow
        contact={item}
        title={item.name}
        onPress={this.onContactPress}
        chevron
      />
    )
  }

  render() {
    return (
      <View style={{ paddingBottom: 50 }}>
        <View style={styles.searchBox}>
          <Input
            placeholder={this.inputPlaceholder()}
            value={this.props.name}
            onChangeText={this.props.nameChanged}
            returnKeyType={'done'}
            disableReturnKey={false}
          />
        {this.showMoreButton()}
        </View>
        <FlatList
          data={this.state.filteredContacts}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => (item.id + Math.random()).toString()}
        />
      </View>
    )
  }
}

const mapStateToProps = ({ contact }) => {
  const { name } = contact
  return { name }
}

export default connect(mapStateToProps, { nameChanged })(ContactSearch)

const styles = {
  searchBox: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 3
  },
  loadButton: {
    margin: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'grey'
  },
  loadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
}
