import React from 'react'
import { View } from 'react-native'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
}

const CardSection = (props) => {
  return (
    <View style={[props.style, styles.container]}>
      {props.children}
    </View>
  )
}

export default CardSection
