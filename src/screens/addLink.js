import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { Button, CheckBox } from 'react-native-elements'
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

  state = { saveToMyLinks: false, token: null, displayCheckBox: true, contacts: [] }

  async componentDidMount() {
    this.onUrlChange('')
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
    this.checkIfLinkExists()
  }

  onUrlChange = (url) => {
    this.props.urlChanged(url)
  }

  onCommentChange = (comment) => {
    this.props.commentChanged(comment)
  }

  async onContactPress(contactId) {
    if (this.state.contacts.includes(contactId)) {
      const newState = this.state.contacts.filter(contact => {
        return contact !== contactId
      })
      await this.setState({ contacts: newState })
      return
    }
    this.setState({ contacts: [...this.state.contacts, contactId] })
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
    const { saveToMyLinks, token, contacts } = this.state
    this.props.urlChanged('')
    this.props.commentChanged('')
    this.props.createLink({ url, comment, contacts, saveToMyLinks, token })
    this.props.navigation.goBack()
  }

  buttonStatus() {
    if (this.state.saveToMyLinks === false && this.state.contacts.length === 0) {
      return true
    }
    return false
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
          <View style={{ flex: 3 }}>
            <ContactPickList
              contacts={this.props.contacts}
              selectedContacts={this.state.contacts}
              groups={this.props.groups}
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
    paddingBottom: 10
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
