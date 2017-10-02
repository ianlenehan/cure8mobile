import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'

const Spinner = ({ size, text }) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} />
      <Text>{text}</Text>
    </View>
  )
}

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default Spinner
