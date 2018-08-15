import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const Spinner = ({ size, text }) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} />
      <Text>{text}</Text>
    </View>
  )
}

export default Spinner
