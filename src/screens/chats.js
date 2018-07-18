import React, { Component } from 'react'
import axios from 'axios'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import RNActionCable from 'react-native-actioncable'
import ActionCableProvider, { ActionCable } from 'react-actioncable-provider'
import Cable from '../components/cable'
import {
  setActiveConversation,
  setConversations,
  getConversations,
  setConversationMessages,
  resetUnreadMessageCount,
} from '../redux/conversation/actions'
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 10,
  },
  title: {
    fontSize: 16,
    paddingTop: 3,
    paddingRight: 5,
    flex: 1,
  },
  unreadContainer: {
    backgroundColor: 'green',
    height: 18,
    width: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
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
    this.props.getConversations(token)
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
    const otherConversations = conversations.filter(
      conversation => conversation.id !== message.conversation_id
    )
    const conversationMessages = [...conversation.messages, message]
    conversation.messages = conversationMessages
    conversation.updated_at = new Date()
    conversation.unread_messages += 1

    this.props.setConversations([conversation, ...otherConversations])
    this.props.setConversationMessages(conversationMessages)
  }

  resetUnreadMessages = async (conversationId) => {
    const token = await AsyncStorage.getItem('token')
    this.props.resetUnreadMessageCount(conversationId, token)
  }

  goToConversation = (conversation) => {
    this.props.setActiveConversation(conversation)
    this.props.setConversationMessages(conversation.messages)
    this.resetUnreadMessages(conversation.id)
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
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title || ''}</Text>
              {item.unread_messages > 0 ? (
                <View style={styles.unreadContainer}>
                  <Text style={styles.unreadCount}>{item.unread_messages}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.subtitleAndDate}>
              <Text style={styles.subtitle}>{item.members.join(", ")}</Text>
              <Text style={styles.subtitle}>{this.formatDate(item.updated_at)}</Text>
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
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
      />
    )
  }

  render() {
    const { conversations, activeConversation } = this.props
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
  const { activeConversation, conversations, conversationMessages } = conversation
  return { activeConversation, conversations, conversationMessages }
}

export default connect(mapStateToProps, {
  setActiveConversation,
  setConversations,
  getConversations,
  setConversationMessages,
  resetUnreadMessageCount,
})(Chats)
