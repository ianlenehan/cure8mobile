import {
  GET_CONTACTS,
  GOT_CONTACTS,
  NAME_CHANGED,
  EDIT_MODE_CHANGED,
  GROUP_NAME_MISSING,
  NOT_AUTHORIZED,
} from '../types'

const initialState = {
  contacts: [],
  groups: [],
  combinedContacts: [],
  name: '',
  contactExists: false,
  loading: '',
  editMode: false,
  error: '',
  authorized: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return { ...state, loading: true }
    case GOT_CONTACTS:
      return {
        ...state,
        contacts: action.payload.contacts,
        groups: action.payload.groups,
        combinedContacts: action.payload.combined_contacts,
        contactExists: action.payload.contactExists,
        loading: false,
      }
    case NAME_CHANGED:
      return { ...state, name: action.payload }
    case EDIT_MODE_CHANGED:
      return { ...state, editMode: action.payload }
    case GROUP_NAME_MISSING:
      return { ...state, error: 'Please provide a group name' }
    case NOT_AUTHORIZED:
      return { ...state, authorized: false }
    default:
      return state
  }
}
