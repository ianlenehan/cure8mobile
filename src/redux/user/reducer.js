import * as types from '../types'

const initialState = {
  info: {},
  activity: [],
  isMember: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GOT_INFO:
      return { ...state, info: action.payload }
    case types.NOT_AUTHORIZED:
      return { ...state, info: false }
    case types.GOT_ACTIVITY:
      return { ...state, activity: action.payload }
    case types.GOT_MEMBERSHIP:
      return { ...state, isMember: action.payload }
    default:
      return state
  }
}
