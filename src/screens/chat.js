import React, { Component } from 'react'
import { Text, Alert, View, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { GiftedChat } from 'react-native-gifted-chat'
import Bubble from '../../node_modules/react-native-gifted-chat/src/Bubble'
import axios from 'axios'
import { setConversationMessages } from '../redux/conversation/actions'

import rootURL from '../../environment'

const apiNamespace = 'v1/'
const apiUrl = `${rootURL}${apiNamespace}`

class Chat extends Component {
  static navigationOptions({ navigation }) {
    const { navigate } = navigation
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
    activeConversationId: null,
  }

  _appendGiftedChatFields(messages) {
    return messages.map(message => {
      message._id = message.id
      message.createdAt = message.created_at
      return message
    })
  }

  componentWillMount() {
    const { conversationMessages, activeConversation } = this.props
    if (!conversationMessages.length) {
      this.props.setConversationMessages(activeConversation.messages)
    }
    const messages = this._appendGiftedChatFields(conversationMessages)
    this.setState({ messages, conversationId: activeConversation.id })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.conversationMessages) {
      const messages = this._appendGiftedChatFields(nextProps.conversationMessages)
      this.setState({ messages })
    }
  }

  async addMessage(messages = []) {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    const token = await AsyncStorage.getItem('token')
    const [message] = messages
    const { userInfo: user } = this.props
    axios.post(`${apiUrl}messages`, {
      message: {
        text: message.text,
        conversation_id: this.state.conversationId,
      },
      user: { token }
    })
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#27ae60'
          }
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
