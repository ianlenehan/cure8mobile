import * as types from '../types'

export const setActiveConversationId = (conversationId) => {
  return {
    type: types.ACTIVE_CONVERSATION_ID_SET,
    payload: conversationId,
  }
}

export const setConversations = (conversations) => {
  return {
    type: types.CONVERSATIONS_SET,
    payload: conversations,
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
