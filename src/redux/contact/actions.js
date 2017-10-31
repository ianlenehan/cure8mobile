import axios from 'axios'
import {
  GET_CONTACTS,
  GOT_CONTACTS,
  NAME_CHANGED,
  EDIT_MODE_CHANGED,
  GROUP_NAME_MISSING,
  NOT_AUTHORIZED
} from '../types'
import rootURL from '../../../environment.js'

export const nameChanged = (name) => {
  return {
    type: NAME_CHANGED,
    payload: name
  }
}

export const saveGroup = (name, contacts, token) => {
  if (name) {
    return (dispatch) => {
      dispatch({ type: GET_CONTACTS })

      axios.post(`${rootURL}groups/create`, {
        group: { name, members: contacts }, user: { token }
      })
      .then(res => {
        let payload
        if (res.data.status === 200) {
          payload = { ...res.data, contactExists: false }
        } else if (res.data.status === 401) {
          dispatch({ type: NOT_AUTHORIZED })
        } else {
          payload = { ...res.data, contactExists: true }
        }
        dispatch({
          type: GOT_CONTACTS,
          payload
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
  return { type: GROUP_NAME_MISSING }
}

export const updateGroup = (id, name, contacts, token) => {
  if (name) {
    return (dispatch) => {
      dispatch({ type: GET_CONTACTS })

      axios.post(`${rootURL}groups/update`, {
        group: { id, name, members: contacts }, user: { token }
      })
      .then(res => {
        let payload
        if (res.data.status === 200) {
          payload = { ...res.data }
        } else if (res.data.status === 401) {
          dispatch({ type: NOT_AUTHORIZED })
        } else {
          payload = { ...res.data }
        }
        dispatch({
          type: GOT_CONTACTS,
          payload
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
  return { type: GROUP_NAME_MISSING }
}

export const saveContact = (name, phone, token) => {
  return (dispatch) => {
    dispatch({ type: GET_CONTACTS })

    axios.post(`${rootURL}contacts/create`, {
      contact: { phone, name }, user: { token }
    })
    .then(res => {
      if (res.data.status === 200) {
        dispatch({
          type: GOT_CONTACTS,
          payload: res.data
        })
      } else if (res.data.status === 401) {
        dispatch({ type: NOT_AUTHORIZED })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export const getContacts = (token) => {
  return (dispatch) => {
    dispatch({ type: GET_CONTACTS })

    axios.post(`${rootURL}user/contacts`, { user: { token } })
    .then(res => {
      if (res.data.status === 200) {
        dispatch({
          type: GOT_CONTACTS,
          payload: res.data
        })
      } else if (res.data.status === 401) {
        dispatch({ type: NOT_AUTHORIZED })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export const deleteContact = (contact, token) => {
  return (dispatch) => {
    axios.post(`${rootURL}user/contacts/delete`, {
      user: { token },
      contact: { id: contact.id }
    })
    .then(res => {
      if (res.data.status === 200) {
        dispatch({
          type: GOT_CONTACTS,
          payload: res.data
        })
      } else if (res.data.status === 401) {
        dispatch({ type: NOT_AUTHORIZED })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export const setEditMode = (editMode) => {
  return {
    type: EDIT_MODE_CHANGED,
    payload: !editMode
  }
}
