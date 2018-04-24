import axios from 'axios'
import { PICKER_CHANGED, COUNTRY_NAME } from '../types'

export const pickerChanged = (countryName, callingCode) => {
  return {
    type: PICKER_CHANGED,
    payload: { countryName, callingCode },
  }
}

export const getUserLocation = () => {
  const url = 'https://freegeoip.net/json/'
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
