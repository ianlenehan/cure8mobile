import React, { Component } from 'react'
import { Text, View, AsyncStorage, ScrollView } from 'react-native'
import { List, ListItem, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import Input from '../components/common/input'
import { nameChanged, saveGroup } from '../redux/contact/actions'

class NewGroup extends Component {
  static navigationOptions = () => {
    return {
      title: 'Create Group',
    }
  }

  state = { members: [], token: null }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
    this.onNameChange('')
  }

  onContactPress = async (contactId) => {
    if (this.state.members.includes(contactId)) {
      const newState = this.state.members.filter(member => {
        return member !== contactId
      })
      await this.setState({ members: newState })
      return
    }
    this.setState({ members: [...this.state.members, contactId] })
  }

  onNameChange = (name) => {
    this.props.nameChanged(name)
  }

  onSavePress = () => {
    const { members, token } = this.state
    this.props.saveGroup(this.props.name, members, token)
    if (this.props.name) {
      this.props.navigation.goBack()
    }
  }

  getRightIcon(contactId) {
    if (this.state.members.includes(contactId)) {
      return { name: 'circle', type: 'font-awesome', color: '#27ae60' }
    }
    return { name: 'circle', type: 'font-awesome', color: '#dcdcdc' }
  }

  render() {
    const { contacts } = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <Input
            placeholder={'Group Name'}
            maxLength={50}
            value={this.props.name}
            onChangeText={this.onNameChange}
          />
        <Text style={styles.error}>{this.props.error}</Text>
        </View>
        <ScrollView>
          <List containerStyle={{ marginBottom: 20, marginTop: 0 }}>
            {
              contacts.map((contact, i) => (
                <ListItem
                  key={i}
                  title={contact.name}
                  subtitle={contact.phone}
                  onPress={() => this.onContactPress(contact.id)}
                  rightTitleStyle={styles.subtitle}
                  rightIcon={this.getRightIcon(contact.id)}
                />
              ))
            }
          </List>
        </ScrollView>
        <View style={styles.buttons}>
          <Button
            title='Save'
            backgroundColor='#27ae60'
            onPress={this.onSavePress}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ contact }) => {
  const { name, error } = contact
  return { name, error }
}

export default connect(mapStateToProps, { nameChanged, saveGroup })(NewGroup)

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  subtitle: {
    fontSize: 12,
  },
  inputView: {
    paddingTop: 10,
    paddingBottom: 15
  },
  buttons: {
    padding: 10
  },
  error: {
    color: 'grey',
    textAlign: 'center',
    marginTop: 5
  },
}
