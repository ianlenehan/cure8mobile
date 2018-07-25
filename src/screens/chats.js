import React, { Component } from 'react'
import moment from 'moment'
import { Text, View, TouchableWithoutFeedback, FlatList, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { ActionCable } from 'react-actioncable-provider'
import Cable from '../components/cable'
import {
  setActiveConversation,
  setConversations,
  getConversations,
  setConversationMessages,
  resetUnreadMessageCount,
} from '../redux/conversation/actions'
import Spinner from '../components/common/spinner'

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
}

class Chats extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conversations: null,
    }
  }

  componentDidMount() {
    this._loadStoredData()
    this._getConversations()
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this._getConversations()),
    ]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.conversations && nextProps.conversations.length) {
      this._storeData(nextProps.conversations)
    }
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove())
  }

  async _loadStoredData() {
    const conversations = await AsyncStorage.getItem('conversationData')
    this.setState({ conversations: JSON.parse(conversations) })
  }

  async _storeData(conversations) {
    await AsyncStorage.setItem('conversationData', JSON.stringify(conversations))
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  _getConversations = async () => {
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
    const conversation = conversations.find(c => c.id === message.conversation_id)
    const otherConversations = conversations.filter(c => c.id !== message.conversation_id)
    const conversationMessages = [...conversation.messages, message]
    conversation.messages = conversationMessages
    conversation.updated_at = new Date()
    if (message.user_id !== this.props.userInfo.id) {
      conversation.unread_messages += 1
    }

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
              <Text style={styles.subtitle}>{item.members.join(', ')}</Text>
              <Text style={styles.subtitle}>{this.formatDate(item.updated_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderContent(conversations) {
    return (
      <FlatList
        data={conversations}
        renderItem={this.renderItem.bind(this)}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
      />
    )
  }

  render() {
    const conversations = this.props.conversations || this.state.conversations
    if (conversations) {
      return (
        <View style={styles.container}>
          <ActionCable
            channel={{ channel: 'ConversationsChannel' }}
            onReceived={this.handleReceivedConversation}
          />
          {conversations.length ? (
            <Cable
              conversations={conversations}
              handleReceivedMessage={this.handleReceivedMessage}
            />
        ) : null}
          {this.renderContent(conversations)}
        </View>
      )
    }
    return (
      <View style={styles.loading}>
        <Spinner size="large" text="Loading chats..." />
      </View>
    )
  }
}

const mapStateToProps = ({ conversation, user }) => {
  const { activeConversation, conversations, conversationMessages } = conversation
  const { info: userInfo } = user
  return { activeConversation, conversations, conversationMessages, userInfo }
}

export default connect(mapStateToProps, {
  setActiveConversation,
  setConversations,
  getConversations,
  setConversationMessages,
  resetUnreadMessageCount,
})(Chats)
