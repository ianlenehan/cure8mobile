import React from 'react'
import { Text } from 'react-native'

const styles = {
  h1: {
    fontSize: 22,
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
}

const H1 = (props) => {
  return <Text style={styles.h1}>{props.text}</Text>
}

export default H1
