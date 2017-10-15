import React from 'react'
import { Text } from 'react-native'

const Title = (props) => {
  if (props.size === 'large') {
    return (
      <Text style={[styles.large, props.style]}>
        {props.title}
      </Text>
    )
  }
  return (
    <Text style={styles.small}>
      {props.title}
    </Text>
  )
}

export default Title

const styles = {
  large: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#27ae60'
  },
  small: {
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  }
}
