import React, { Component } from 'react'
import { Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { GiftedChat } from 'react-native-gifted-chat'
import Bubble from '../../node_modules/react-native-gifted-chat/src/Bubble'

const styles = {

}

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
    const { conversationMessages, activeConversationId } = this.props
    const messages = this._appendGiftedChatFields(conversationMessages)
    this.setState({ messages: conversationMessages,  conversationId: activeConversationId })
  }

  componentWillReceiveProps(nextProps) {
    console.log('rece props', nextProps)
    if (nextProps.conversationMessages) {
      const messages = this._appendGiftedChatFields(nextProps.conversationMessages)
      this.setState({ messages: nextProps.conversationMessages })
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  addMessage(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    const [message] = messages
    const { userInfo: user } = this.props
    fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        text: message.text,
        conversation_id: this.state.conversationId,
        user_id: user.id,
      })
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
    console.log('rendering messages', this.props.conversationMessages)
    return (
      <GiftedChat
        messages={this.props.conversationMessages}
        onSend={messages => this.addMessage(messages)}
        renderBubble={this.renderBubble}
        inverted={false}
        user={{
          _id: this.props.userInfo.id,
        }}
      />
    )
  }
}

const mapStateToProps = ({ conversation, user }) => {
  const { activeConversationId, conversationMessages } = conversation
  const { info: userInfo } = user
  return { activeConversationId, conversationMessages, userInfo }
}

export default connect(mapStateToProps, { })(Chat)
