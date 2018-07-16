import axios from 'axios'
import * as types from '../types'
import rootURL from '../../../environment'

const apiNamespace = 'v1/'
const apiUrl = `${rootURL}${apiNamespace}`

const sortConversations = (conversations) => {
  return conversations.sort((a, b) => {
    a = new Date(a.last_update)
    b = new Date(b.last_update)
    return a > b ? -1 : a < b ? 1 : 0
  })
}

export const setActiveConversation = (conversation) => {
  return {
    type: types.ACTIVE_CONVERSATION_SET,
    payload: conversation,
  }
}

export const getConversations = (token) => {
  return async (dispatch) => {
    const res = await axios.post(`${apiUrl}user_conversations`, {
      user: { token },
    })
    const sortedConversations = sortConversations(res.data)
    if (res.status === 200) {
      dispatch({
        type: types.CONVERSATIONS_SET,
        payload: sortedConversations,
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
  const sortedConversations = sortConversations(conversations)
  return {
    type: types.CONVERSATIONS_SET,
    payload: sortedConversations,
  }
}

export const setConversationMessages = (messages) => {
  const sortedMessages = messages.sort((a, b) => {
    a = new Date(a.created_at)
    b = new Date(b.created_at)
    return a > b ? -1 : a < b ? 1 : 0
  })
  return {
    type: types.CONVERSATION_MESSAGES_SET,
    payload: sortedMessages,
  }
}
