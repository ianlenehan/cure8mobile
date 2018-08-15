import { combineReducers } from 'redux'
import authReducer from './auth/reducer'
import linkReducer from './link/reducer'
import contactReducer from './contact/reducer'
import pickerReducer from './picker/reducer'
import userReducer from './user/reducer'
import conversationReducer from './conversation/reducer'

export default combineReducers({
  auth: authReducer,
  link: linkReducer,
  contact: contactReducer,
  picker: pickerReducer,
  user: userReducer,
  conversation: conversationReducer,
})
