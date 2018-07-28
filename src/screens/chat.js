import React, { Component } from 'react'
import { View, AsyncStorage, AppState } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { GiftedChat } from 'react-native-gifted-chat'
import axios from 'axios'
import Bubble from '../../node_modules/react-native-gifted-chat/src/Bubble'
import { setConversationMessages } from '../redux/conversation/actions'

import rootURL from '../../environment'

const apiNamespace = 'v1/'
const apiUrl = `${rootURL}${apiNamespace}`

class Chat extends Component {
  static navigationOptions({ navigation }) {
    const { params = {} } = navigation.state
    return {
      headerTitle: params.title,
      tabBarLabel: 'Chats',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="comments" type="font-awesome" size={24} color={tintColor} />;
      },
    }
  }

  state = {
    messages: [],
    appState: AppState.currentState,
  }

  componentWillMount() {
    this._setConversationMessages()
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.conversationMessages) {
      const messages = this._appendGiftedChatFields(nextProps.conversationMessages)
      this.setState({ messages })
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _setConversationMessages() {
    const { conversationMessages, activeConversation } = this.props
    if (!conversationMessages.length) {
      this.props.setConversationMessages(activeConversation.messages)
    }
    const messages = this._appendGiftedChatFields(conversationMessages)
    this.setState({ messages, conversationId: activeConversation.id })
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this._setConversationMessages()
    }
    this.setState({ appState: nextAppState })
  }

  _appendGiftedChatFields(messages) {
    return messages.map(message => {
      const newMessage = { ...message }
      newMessage._id = message.id
      newMessage.createdAt = message.created_at
      return newMessage
    })
  }

  async addMessage(messages = []) {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    const token = await AsyncStorage.getItem('token')
    const [message] = messages
    axios.post(`${apiUrl}messages`, {
      message: {
        text: message.text,
        conversation_id: this.state.conversationId,
      },
      user: { token },
    })
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#27ae60',
          },
        }}
      />
    )
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.addMessage(messages)}
          renderBubble={this.renderBubble}
          bottomOffset={50}
          user={{
            _id: this.props.userInfo.id,
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = ({ conversation, user }) => {
  const { activeConversation, conversationMessages } = conversation
  const { info: userInfo } = user
  return { activeConversation, conversationMessages, userInfo }
}

export default connect(mapStateToProps, { setConversationMessages })(Chat)
