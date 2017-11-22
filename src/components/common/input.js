import React from 'react'
import { TextInput, Platform } from 'react-native'

const Input = (props) => {
  const {
    value,
    onChangeText,
    green,
    keyboardType,
    placeholder,
    secureTextEntry,
    maxLength,
    multiline,
    autoCapitalize,
    returnKeyType,
    onBlur,
    disableReturnKey,
  } = props

  const defaultStyle = green ? styles.green : styles.white

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[defaultStyle, props.style]}
      keyboardType={keyboardType}
      placeholderTextColor={green ? '#ecf0f1' : 'grey'}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      maxLength={maxLength}
      multiline={multiline}
      underlineColorAndroid={green ? 'white' : 'grey'}
      autoCapitalize={autoCapitalize || 'sentences'}
      returnKeyType={returnKeyType}
      onBlur={onBlur}
      enablesReturnKeyAutomatically={disableReturnKey}
    />
  )
}

export default Input

const styles = {
  white: {
    height: 40,
    padding: 4,
    marginTop: 5,
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : '#f3f3f3',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  green: {
    height: 40,
    padding: 4,
    marginTop: 5,
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : '#219452',
    color: '#fff',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
}
