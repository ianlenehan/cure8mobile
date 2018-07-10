import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import RNActionCable from 'react-native-actioncable'
import ActionCableProvider, { ActionCable } from 'react-actioncable-provider'
import Cable from '../components/cable'
import { setActiveConversationId, setConversations, setConversationMessages } from '../redux/conversation/actions'
import moment from 'moment'

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    paddingTop: 3,
    paddingRight: 5,
  },
  subtitle: {
    fontSize: 12,
    color: 'grey',
  },
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  subtitleAndDate: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
}

function getSubtitle(chat) {
  const names = chat.members.map(member => member.first_name)
  return names.join(', ')
}

class Chats extends Component {
  static navigationOptions() {
    return {
      headerTitle: 'Chats',
      tabBarLabel: 'Chats',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="comments" type="font-awesome" size={24} color={tintColor} />
      },
    }
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token')
    const res = await fetch('http://localhost:3000/user_conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        user: { token }
      })
    })
    const conversations = await res.json()
    this.props.setConversations(conversations)
  }

  handleReceivedConversation = response => {
    const { conversation } = response
    const conversations = [...this.props.conversations, conversation]
    this.props.setConversations(conversations)
  }

  handleReceivedMessage = response => {
    const { message } = response
    const conversations = [...this.props.conversations]
    const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    )
    const conversationMessages = [...conversation.messages, message]
    conversation.messages = conversationMessages
    this.props.setConversations(conversations)
    this.props.setConversationMessages(conversationMessages)
  }

  goToConversation = (conversation) => {
    this.props.setActiveConversationId(conversation.id)
    this.props.setConversationMessages(conversation.messages)
    this.props.navigation.navigate('chat', { title: conversation.title })
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  renderItem({ item }) {
    return (
      <TouchableWithoutFeedback onPress={() => this.goToConversation(item)}>
        <View style={styles.card}>
          <View style={styles.details}>
            <Text style={styles.title}>{item.title || ''}</Text>
            <View style={styles.subtitleAndDate}>
              <Text style={styles.subtitle}>{item.members.join(", ")}</Text>
              <Text style={styles.subtitle}>{this.formatDate(item.last_update)}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderContent() {
    return (
      <FlatList
        data={this.props.conversations}
        renderItem={this.renderItem.bind(this)}
        editMode={this.props.editMode}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
      />
    )
  }

  render() {
    const { conversations, activeConversationId } = this.props
    return (
      <View style={styles.container}>
        <ActionCable
          channel={{ channel: 'ConversationsChannel' }}
          onReceived={this.handleReceivedConversation}
        />
        {this.props.conversations.length ? (
          <Cable
            conversations={conversations}
            handleReceivedMessage={this.handleReceivedMessage}
          />
        ) : null}
        {this.renderContent()}
      </View>
    )
  }
}

const mapStateToProps = ({ conversation }) => {
  const { activeConversationId, conversations, conversationMessages } = conversation
  return { activeConversationId, conversations, conversationMessages }
}

export default connect(mapStateToProps, {
  setActiveConversationId,
  setConversations,
  setConversationMessages,
})(Chats)
