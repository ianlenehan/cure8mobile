import axios from 'axios'
import * as types from '../types'
import rootURL from '../../../environment'

const apiNamespace = 'v1/'
const apiUrl = `${rootURL}${apiNamespace}`

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
    if (res.status === 200) {
      dispatch({
        type: types.CONVERSATIONS_SET,
        payload: res.data,
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

export const getUserInfo = (token) => {
  return (dispatch) => {
    axios.post(`${apiUrl}user/info`, {
      user: { token },
    })
      .then(res => {
        if (res.data.status === 200) {
          dispatch({
            type: types.GOT_INFO,
            payload: res.data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const setConversations = (conversations) => {
  const sortedConversations = conversations.sort((a, b) => {
    return b.last_update > a.last_update
  })
  return {
    type: types.CONVERSATIONS_SET,
    payload: sortedConversations,
  }
}

export const setConversationMessages = (messages) => {
  const sortedMessages = messages.sort((a, b) => {
    return b.created_at > a.created_at
  })
  return {
    type: types.CONVERSATION_MESSAGES_SET,
    payload: sortedMessages,
  }
}
