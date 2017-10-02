import * as types from '../types'

const initialState = {
  info: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GOT_INFO:
      return { ...state, info: action.payload }
    case types.NOT_AUTHORIZED: {
      return { ...state, info: false }
    }
    default:
      return state
  }
}
