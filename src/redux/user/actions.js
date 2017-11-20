import axios from 'axios'
import { Platform, AsyncStorage } from 'react-native'
import * as types from '../types'
import rootURL from '../../../environment'

export const updateUser = (token, value, field, userInfo = {}) => {
  let fieldName
  const newInfo = { ...userInfo }
  switch (field) {
    case 'getRatingNotifications':
      fieldName = 'notifications_new_rating'
      newInfo.notifications.rating = value
      break
    case 'getCurationNotifications':
      fieldName = 'notifications_new_link'
      newInfo.notifications.curation = value
      break
    case 'notifications':
      fieldName = 'notifications'
      newInfo.notifications.push = value
      break
    default:
      fieldName = field
  }

  return (dispatch) => {
    dispatch({
      type: types.GOT_INFO,
      payload: newInfo
    })
    axios.post(`${rootURL}user/update`, { user: { token, field: fieldName, value } })
      .then(res => {
        if (res.data.status === 200) {
          dispatch({
            type: types.GOT_INFO,
            payload: res.data
          })
        }
      })
  }
}

export const getUserInfo = (token) => {
  return (dispatch) => {
    axios.post(`${rootURL}user/info`, {
      user: { token },
    })
    .then(res => {
      if (res.data.status === 200) {
        dispatch({
          type: types.GOT_INFO,
          payload: res.data
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export const getUserActivity = (token) => {
  return (dispatch) => {
    axios.post(`${rootURL}user/activity`, {
      user: { token },
    })
    .then(res => {
      if (res.data.status === 200) {
        dispatch({
          type: types.GOT_ACTIVITY,
          payload: res.data.data
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export const isUserAMember = () => {
  return async (dispatch) => {
    const membership = await AsyncStorage.getItem('membership')
    const isIOS = Platform.OS === 'ios'
    let isAMember = !!membership
    if (!isIOS) {
      isAMember = true
    }
    if (isAMember) await AsyncStorage.removeItem('limitReached')
    dispatch({
      type: types.GOT_MEMBERSHIP,
      payload: isAMember,
    })
  }
}
