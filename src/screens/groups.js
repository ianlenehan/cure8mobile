import React, { Component } from 'react'
import { AsyncStorage, View, ScrollView, Text, LayoutAnimation } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import ContactRow from '../components/contactRow'
import Spinner from '../components/common/spinner'
import { deleteContact, setEditMode, updateGroup } from '../redux/contact/actions'

class Groups extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: 'My Groups',
      headerRight: (
        <Button
          title={params.editMode ? 'Done' : 'Edit'}
          backgroundColor='rgba(0,0,0,0)'
          onPress={() => params.setEditMode()}
        />
      ),
    }
  }

  state = { activeGroup: null }

  async componentDidMount() {
    this.props.navigation.setParams({
      setEditMode: this.setEditMode.bind(this),
      editMode: false
    })

    const token = await AsyncStorage.getItem('token')
    this.setState({ token, groups: this.props.groups })
  }

  onDeletePress = (group) => {
    this.props.deleteContact(group, this.state.token)
  }

  onGroupPress = async (group) => {
    if (this.state.activeGroup) {
      await this.setState({ activeGroup: null })
      this.renderGroupMembers(group)
    } else {
      await this.setState({ activeGroup: group.id })
      this.renderGroupMembers(group)
    }
  }

  setEditMode = async () => {
    await this.props.setEditMode(this.props.editMode)
    this.props.navigation.setParams({
      editMode: this.props.editMode
    })
  }

  renderGroupMembers = (group) => {
    const { activeGroup } = this.state
    if (activeGroup === group.id) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      return group.members.map(member => {
        return <Text style={styles.groupMembers} key={member.id}>{member.name}</Text>
      })
    }
  }

  onEditPress = (group) => {
    const { contacts } = this.props
    this.props.navigation.navigate('newGroup', { group, contacts })
  }

  renderContent() {
    if (this.props.loading) {
      return <Spinner size='large' text='Loading groups...' />
    }
    return this.props.groups.map(group => {
      return (
        <View key={group.id}>
          <ContactRow
            contact={group}
            group
            title={group.name}
            rightTitle={group.members ? `${group.members.length} Members` : null}
            onPress={() => this.onGroupPress(group)}
            editMode={this.props.editMode}
            onDeletePress={() => this.onDeletePress(group)}
            onEditPress={() => this.onEditPress(group)}
          />
        {this.renderGroupMembers(group)}
      </View>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          {this.renderContent()}
        </ScrollView>
        <Button
          icon={{ name: 'plus', type: 'font-awesome' }}
          title='New Group'
          backgroundColor='#27ae60'
          onPress={() => this.props.navigation.navigate(
              'newGroup', { contacts: this.props.contacts })}
          buttonStyle={styles.button}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  button: {
    margin: 10
  },
  groupMembers: {
    backgroundColor: '#ecf0f1',
    paddingLeft: 20,
    fontSize: 16,
    padding: 5
  }
}

const mapStateToProps = ({ contact }) => {
  const { contacts, groups, loading, editMode } = contact
  return { contacts, groups, loading, editMode }
}

export default connect(mapStateToProps, { deleteContact, setEditMode })(Groups)
