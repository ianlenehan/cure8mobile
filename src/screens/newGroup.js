import React, { Component } from 'react'
import { Text, View, AsyncStorage, ScrollView } from 'react-native'
import { List, ListItem, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import Input from '../components/common/input'
import {
  nameChanged,
  saveGroup,
  updateGroup,
} from '../redux/contact/actions'

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
  },
  inputView: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  buttons: {
    padding: 10,
  },
  error: {
    color: 'grey',
    textAlign: 'center',
    marginTop: 5,
  },
}

class NewGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const title = params.group ? 'Edit Group' : 'Create Group'
    return { title }
  }

  state = { members: [], token: null }

  async componentDidMount() {
    this._setToken()
    let groupName = ''
    const { params } = this.props.navigation.state
    if (params.group) {
      this.setGroupMembers(params.group)
      groupName = params.group.name
    }
    this.onNameChange(groupName)
  }

  onContactPress = async (contact) => {
    if (this.state.members.includes(contact.id)) {
      const newState = this.state.members.filter(memberId => {
        return memberId !== contact.id
      })
      await this.setState({ members: newState })
      return
    }
    this.setState({ members: [...this.state.members, contact.id] })
  }

  onNameChange = (name) => {
    this.props.nameChanged(name)
  }

  onSavePress = () => {
    const { members, token } = this.state
    const { params } = this.props.navigation.state
    if (params.group) {
      this.props.updateGroup(params.group.id, this.props.name, members, token)
    } else {
      this.props.saveGroup(this.props.name, members, token)
    }
    if (this.props.name) {
      this.props.navigation.goBack()
    }
  }

  setGroupMembers(group) {
    const members = group.members.map(member => member.group_id)
    this.setState({ members })
  }

  getRightIcon(contact) {
    if (this.state.members.includes(contact.id)) {
      return { name: 'circle', type: 'font-awesome', color: '#27ae60' }
    }
    return { name: 'circle', type: 'font-awesome', color: '#dcdcdc' }
  }

  async _setToken() {
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  render() {
    const { contacts } = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <Input
            placeholder="Group Name"
            maxLength={50}
            value={this.props.name}
            onChangeText={this.onNameChange}
          />
          <Text style={styles.error}>{this.props.error}</Text>
        </View>
        <ScrollView>
          <List containerStyle={{ marginBottom: 20, marginTop: 0 }}>
            {
              contacts.map((contact) => (
                <ListItem
                  key={contact.phone}
                  title={contact.name}
                  subtitle={contact.phone}
                  onPress={() => this.onContactPress(contact)}
                  rightTitleStyle={styles.subtitle}
                  rightIcon={this.getRightIcon(contact)}
                />
              ))
            }
          </List>
        </ScrollView>
        <View style={styles.buttons}>
          <Button
            title="Save"
            backgroundColor="#27ae60"
            onPress={this.onSavePress}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ contact }) => {
  const { name, error, editMode } = contact
  return { name, error, editMode }
}

export default connect(mapStateToProps, {
  nameChanged, saveGroup, updateGroup,
})(NewGroup)
