import React, { Component } from 'react'
import {
  View,
  FlatList,
  AsyncStorage,
  AppState,
  LayoutAnimation,
} from 'react-native'
import { connect } from 'react-redux'
import { ActionCable } from 'react-actioncable-provider'
import Cable from '../components/cable'
import {
  setActiveConversation,
  setConversations,
  getConversations,
  setConversationMessages,
  resetUnreadMessageCount,
  deleteConversation,
} from '../redux/conversation/actions'
import Spinner from '../components/common/spinner'
import ChatListItem from '../components/chatListItem'

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
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
      appState: AppState.currentState,
      enable: true,
    }
  }

  async componentDidMount() {
    await this.setToken()
    AppState.addEventListener('change', this._handleAppStateChange)
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this._getConversations()),
    ]
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.subs.forEach(sub => sub.remove())
  }

  async setToken() {
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  setScrollEnabled(enable) {
    this.setState({ enable })
  }

  swipeSuccess = (shouldDelete, itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.props.deleteConversation(
      this.props.conversations,
      itemId,
      shouldDelete,
      this.state.token,
    )
  }

  async _loadStoredData() {
    const conversations = await AsyncStorage.getItem('conversationData')
    this.setState({ conversations: JSON.parse(conversations) })
  }

  async _storeData(conversations) {
    await AsyncStorage.setItem('conversationData', JSON.stringify(conversations))
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this._getConversations()
    }
    this.setState({ appState: nextAppState })
  }

  _getConversations = () => {
    this.props.getConversations(this.state.token)
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

  resetUnreadMessages = (conversationId) => {
    this.props.resetUnreadMessageCount(conversationId, this.state.token)
  }

  goToConversation = (conversation) => {
    this.props.setActiveConversation(conversation)
    this.props.setConversationMessages(conversation.messages)
    this.resetUnreadMessages(conversation.id)
    this.props.navigation.navigate('chat', { title: conversation.title })
  }

  renderItem = ({ item }) => {
    return (
      <ChatListItem
        item={item}
        goToConversation={this.goToConversation}
        swipeSuccess={this.swipeSuccess}
        setScrollEnabled={enable => this.setScrollEnabled(enable)}
      />
    )
  }

  renderContent(conversations) {
    return (
      <FlatList
        data={conversations}
        renderItem={this.renderItem}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
        scrollEnabled={this.state.enable}
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
  deleteConversation,
})(Chats)
