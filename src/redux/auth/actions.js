import { AsyncStorage } from "react-native";
import axios from "axios";
import {
  PHONE_CHANGED,
  CODE_CHANGED,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGGED_OUT,
  GET_CODE,
  GET_CODE_ERROR,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  CREATE_ACCOUNT_FAIL,
  PHONE_RESET,
  CODE_REQUESTED
} from "../types";
import rootURL from "../../../environment";

const apiNamespace = "v1/";
const apiUrl = `${rootURL}${apiNamespace}`;

const formatPhone = (phone, callingCode) => {
  const numbersOnly = Number(phone.replace(/[^\d]/g, ""));
  return `+${callingCode}${numbersOnly}`;
};

const loginUserSuccess = async (dispatch, res) => {
  const { id, name, phone: phn } = res.data.user;
  const { token } = res.data;
  await AsyncStorage.multiSet([
    ["token", token],
    ["currentUserId", id.toString()],
    ["currentUserName", name],
    ["currentUserPhone", phn.toString()]
  ]);
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: res.data
  });
};

const loginUserFailure = dispatch => {
  dispatch({ type: LOGIN_USER_FAIL });
};

export const phoneChanged = (phone, callingCode) => {
  const formattedPhone = formatPhone(phone, callingCode);
  return {
    type: PHONE_CHANGED,
    payload: { phone, formattedPhone }
  };
};

export const codeChanged = code => {
  return {
    type: CODE_CHANGED,
    payload: code
  };
};

export const firstNameChanged = text => {
  return {
    type: FIRST_NAME_CHANGED,
    payload: text
  };
};

export const lastNameChanged = text => {
  return {
    type: LAST_NAME_CHANGED,
    payload: text
  };
};

export const resetPhoneNumber = () => {
  return {
    type: PHONE_RESET
  };
};

export const getTemporaryCode = formattedPhone => {
  return dispatch => {
    dispatch({ type: CODE_REQUESTED });

    axios
      .post(`${apiUrl}users/request`, { user: { phone: formattedPhone } })
      .then(res => {
        if (res.data.status === 200) {
          dispatch({
            type: GET_CODE,
            payload: res.data.message
          });
        } else {
          dispatch({
            type: GET_CODE_ERROR,
            payload: res.data.message
          });
        }
      })
      .catch(err => {
        dispatch({
          type: GET_CODE_ERROR,
          payload: `So... something's wrong. (${err})`
        });
      });
  };
};

export const logUserIn = ({ formattedPhone, code }) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER });

    axios
      .post(`${apiUrl}login`, { user: { phone: formattedPhone, code } })
      .then(res => {
        if (res.data.status === 200) {
          loginUserSuccess(dispatch, res);
        } else {
          loginUserFailure(dispatch);
        }
      })
      .catch(error => {
        loginUserFailure(dispatch);
        console.log(error);
      });
  };
};

export const logUserOut = token => {
  return dispatch => {
    axios
      .post(`${apiUrl}logout`, { user: { token } })
      .then(() => {
        dispatch({ type: LOGGED_OUT });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const createAccount = ({
  formattedPhone,
  code,
  firstName,
  lastName
}) => {
  if (firstName && lastName) {
    return dispatch => {
      dispatch({ type: LOGIN_USER });

      axios
        .post(`${apiUrl}login`, {
          user: {
            phone: formattedPhone,
            code,
            first_name: firstName,
            last_name: lastName
          }
        })
        .then(res => {
          if (res.data.status === 200) {
            loginUserSuccess(dispatch, res);
          } else {
            loginUserFailure(dispatch);
          }
        })
        .catch(error => {
          loginUserFailure(dispatch);
          console.log(error);
        });
    };
  }
  return { type: CREATE_ACCOUNT_FAIL };
};
