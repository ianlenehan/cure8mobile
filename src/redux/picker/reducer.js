import { PICKER_CHANGED, COUNTRY_NAME } from '../types'

const initialState = { countryName: '', callingCode: '' }

export default (state = initialState, action) => {
  switch (action.type) {
    case PICKER_CHANGED:
      return {
        ...state,
        countryName: action.payload.countryName,
        callingCode: action.payload.callingCode
      }
    case COUNTRY_NAME:
      return { ...state, countryName: action.payload }
    default:
      return state
  }
}
