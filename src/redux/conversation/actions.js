import axios from 'axios'
import * as types from '../types'
import rootURL from '../../../environment'

const apiNamespace = 'v1/'
const apiUrl = `${rootURL}${apiNamespace}`

const _sortConversations = (conversations) => {
  return conversations.sort((a, b) => {
    const x = new Date(a.updated_at)
    const y = new Date(b.updated_at)
    return x > y ? -1 : x < y ? 1 : 0 // eslint-disable-line
  })
}

export const setActiveConversation = (conversation) => {
  return {
    type: types.ACTIVE_CONVERSATION_SET,
    payload: conversation,
  }
}

const _getUnreadMessages = (conversations) => {
  return conversations.reduce((total, conversation) => {
    return conversation.unread_messages + total
  }, 0)
}

export const getConversations = (token) => {
  return async (dispatch) => {
    const res = await axios.post(`${apiUrl}user_conversations`, {
      user: { token },
    })
    const sortedConversations = _sortConversations(res.data)
    const unreadMessages = _getUnreadMessages(sortedConversations)
    if (res.status === 200) {
      dispatch({
        type: types.CONVERSATIONS_SET,
        payload: { conversations: sortedConversations, unreadMessages },
      })
    } else {
      console.log('get conversations error', res.status)
    }
  }
}

export const createConversation = ({ link_id, users_shared_with, chatType, token }) => {
  return async (dispatch) => {
    const res = await axios.post(`${apiUrl}conversations`, {
      conversation: {
        link_id,
        users_shared_with,
        chat_type: chatType,
      },
      user: { token },
    })
    dispatch({
      type: types.CONVERSATION_CREATED,
      payload: res.data,
    })
  }
}

export const setConversations = (conversations) => {
  const sortedConversations = _sortConversations(conversations)
  const unreadMessages = _getUnreadMessages(sortedConversations)
  return {
    type: types.CONVERSATIONS_SET,
    payload: { conversations: sortedConversations, unreadMessages },
  }
}

export const setConversationMessages = (messages) => {
  const sortedMessages = messages.sort((a, b) => {
    const x = new Date(a.created_at)
    const y = new Date(b.created_at)
    return x > y ? -1 : x < y ? 1 : 0 // eslint-disable-line
  })
  return {
    type: types.CONVERSATION_MESSAGES_SET,
    payload: sortedMessages,
  }
}

export const resetUnreadMessageCount = (conversationId, token) => {
  return async (dispatch) => {
    const res = await axios.post(`${apiUrl}conversations/reset`, {
      user: { token },
      conversation: { id: conversationId },
    })
    const sortedConversations = _sortConversations(res.data)
    const unreadMessages = _getUnreadMessages(sortedConversations)
    if (res.status === 200) {
      dispatch({
        type: types.CONVERSATIONS_SET,
        payload: { conversations: sortedConversations, unreadMessages },
      })
    } else {
      console.log('get conversations error', res.status)
    }
  }
}
