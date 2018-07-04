import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem, Icon } from 'react-native-elements'
import RNActionCable from 'react-native-actioncable'
import ActionCableProvider, { ActionCable } from 'react-actioncable-provider'
import Cable from '../components/cable'
import { setActiveConversationId, setConversations, setConversationMessages } from '../redux/conversation/actions'

const chatList = [
  {
    title: "Singapore: Anthony Bourdain's field notes",
    image: 'https://explorepartsunknown.com/wp-content/uploads/2017/09/25219_024_0032_r.jpg?quality=95&strip=color',
    id: 1,
    members: [
      { first_name: 'Ian', last_name: 'Lenehan', id: 1 },
      { first_name: 'Sharon', last_name: 'Chen', id: 162 },
    ],
  },
]

const styles = {

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
    const res = await fetch('http://localhost:3000/conversations')
    const conversations = await res.json()

    this.props.setConversations(conversations)
  }

  handleReceivedConversation = response => {
    const { conversation } = response
    const conversations = [...this.props.conversations, conversation]
    this.props.setConversations(conversations)
  }

  handleReceivedMessage = response => {
    console.log('handling received message', response)
    const { message } = response
    const conversations = [...this.props.conversations]
    const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    )
    const conversationMessages = [...conversation.messages, message]
    this.props.setConversations(conversations)
    this.props.setConversationMessages(conversationMessages)
  }

  goToConversation = (conversation) => {
    console.log('go to conver', conversation.messages)
    this.props.setActiveConversationId(conversation.id)
    this.props.setConversationMessages(conversation.messages)
    this.props.navigation.navigate('chat', { title: conversation.title })
  }

  render() {
    const { conversations, activeConversationId } = this.props
    return (
      <View style={styles.conversationsList}>
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
        <Text>Conversations</Text>
        <List containerStyle={styles.container}>
          {
            conversations.map((chat) => (
              <ListItem
                key={chat.id}
                title={chat.title}
                onPress={() => this.goToConversation(chat)}
                hideChevron
              />
            ))
        }
        </List>
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
