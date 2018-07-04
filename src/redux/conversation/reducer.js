import * as types from '../types'

const initialState = {
  activeConversation: null,
  conversations: [],
  conversationMessages: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTIVE_CONVERSATION_ID_SET:
      return { ...state, activeConversationId: action.payload }
    case types.CONVERSATIONS_SET:
      return { ...state, conversations: action.payload }
    case types.CONVERSATION_MESSAGES_SET:
      return { ...state, conversationMessages: action.payload }
    default:
      return state
  }
}
