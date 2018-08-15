import * as types from '../types'

const initialState = {
  activeConversation: null,
  conversations: null,
  conversationMessages: [],
  unreadMessages: 0,
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTIVE_CONVERSATION_SET:
      return { ...state, activeConversation: action.payload }
    case types.CONVERSATIONS_SET:
      return {
        ...state,
        conversations: action.payload.conversations,
        unreadMessages: action.payload.unreadMessages,
      }
    case types.CONVERSATION_MESSAGES_SET:
      return { ...state, conversationMessages: action.payload }
    case types.CREATING_CONVERSATION:
      return { ...state, loading: true }
    case types.CONVERSATION_CREATED:
      return {
        ...state,
        activeConversation: action.payload,
        conversationMessages: [],
        loading: false,
      }
    default:
      return state
  }
}
