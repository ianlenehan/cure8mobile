import {
  PHONE_CHANGED,
  CODE_CHANGED,
  CODE_REQUESTED,
  GET_CODE,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGGED_OUT,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  CREATE_ACCOUNT_FAIL,
  PHONE_RESET
} from '../types'

const initialState = {
  phone: '',
  formattedPhone: '',
  code: '',
  buttonText: '',
  token: '',
  user: {},
  countryName: '',
  callingCode: '',
  loading: false,
  error: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PHONE_CHANGED:
      return {
        ...state,
        phone: action.payload.phone,
        formattedPhone: action.payload.formattedPhone
      }
    case CODE_CHANGED:
      return { ...state, code: action.payload }
    case CODE_REQUESTED:
      return { ...state, loading: true }
    case GET_CODE:
      return { ...state, loading: false, buttonText: action.payload }
    case LOGIN_USER:
      return { ...state, loading: true, error: '' }
    case LOGGED_OUT:
      return { ...initialState }
    case FIRST_NAME_CHANGED:
      return { ...state, firstName: action.payload }
    case LAST_NAME_CHANGED:
      return { ...state, lastName: action.payload }
    case LOGIN_USER_SUCCESS:
      return { ...state, token: action.payload.token, user: action.payload.user }
    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed.', code: '', loading: false }
    case PHONE_RESET:
      return { ...state, code: '', phone: '', buttonText: '' }
    case CREATE_ACCOUNT_FAIL:
      return { ...state, error: 'Please fill out all fields.' }
    default:
      return state
  }
}
