import * as types from '../types'

const initialState = {
  activeConversation: null,
  conversations: null,
  conversationMessages: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTIVE_CONVERSATION_SET:
      return { ...state, activeConversation: action.payload }
    case types.CONVERSATIONS_SET:
      return { ...state, conversations: action.payload }
    case types.CONVERSATION_MESSAGES_SET:
      return { ...state, conversationMessages: action.payload }
    case types.CONVERSATION_CREATED:
      return {
        ...state,
        activeConversation: action.payload,
        conversationMessages: [],
      }
    default:
      return state
  }
}
