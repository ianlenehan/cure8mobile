import React, { Component } from 'react'
import { AsyncStorage, FlatList, View } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import ContactRow from '../components/contactRow'
import Spinner from '../components/common/spinner'
import { deleteContact, setEditMode } from '../redux/contact/actions'

class Contacts extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation
    const { params = {} } = navigation.state

    return {
      title: 'My Contacts',
      headerRight: (
        <Button
          fontSize={14}
          title={params.editMode ? 'Done' : 'Edit'}
          backgroundColor='rgba(0,0,0,0)'
          onPress={() => params.setEditMode()}
        />
      ),
      headerLeft: (
        <Button
          fontSize={14}
          icon={{ name: 'users', type: 'font-awesome' }}
          iconLeft
          backgroundColor='rgba(0,0,0,0)'
          onPress={() => navigate('myGroups')}
        />
      )
    }
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      setEditMode: this.setEditMode.bind(this),
      editMode: false
    })
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  onDeletePress = (contact) => {
    this.props.deleteContact(contact, this.state.token)
  }

  setEditMode = async () => {
    await this.props.setEditMode(this.props.editMode)
    this.props.navigation.setParams({
      editMode: this.props.editMode
    })
  }

  renderItem({ item }) {
    return (
      <ContactRow
        contact={item}
        title={item.name}
        isMember={item.member}
        rightTitle={item.phone}
        onPress={() => console.log(item)}
        editMode={this.props.editMode}
        onDeletePress={() => this.onDeletePress(item)}
      />
    )
  }

  renderContent() {
    if (this.props.loading) {
      return <Spinner size='large' text='Loading contacts...' />
    }
    return (
      <FlatList
        data={this.props.contacts}
        renderItem={this.renderItem.bind(this)}
        editMode={this.props.editMode}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        <Button
          icon={{ name: 'plus', type: 'font-awesome' }}
          title='New Contact'
          backgroundColor='#27ae60'
          onPress={() => this.props.navigation.navigate('contactSearch')}
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
  }
}

const mapStateToProps = ({ contact }) => {
  const { contacts, groups, contactExists, editMode, loading } = contact
  return { contacts, groups, contactExists, editMode, loading }
}

export default connect(mapStateToProps, { deleteContact, setEditMode })(Contacts)
