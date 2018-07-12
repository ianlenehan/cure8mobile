import axios from 'axios'
import { PICKER_CHANGED, COUNTRY_NAME } from '../types'

export const pickerChanged = (countryName, callingCode) => {
  return {
    type: PICKER_CHANGED,
    payload: { countryName, callingCode },
  }
}

export const getUserLocation = () => {
  const url = 'http://api.ipstack.com/check?access_key=20b4e66a4f515700a5e0f39fdd34474d'
  return (dispatch) => {
    axios.get(url)
      .then(res => {
        dispatch({
          type: COUNTRY_NAME,
          payload: res.data.country_name,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
