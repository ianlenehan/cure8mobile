import React from 'react'
import { View, Text } from 'react-native'

const Header = (props) => {
  return (
    <View style={[styles.header, props.style]}>
      <Text style={[styles.headerText, props.textStyle]}>cure8</Text>
    </View>
  )
}

const styles = {
  header: {
    height: 50,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60'
  },
  headerText: {
    fontSize: 18,
    color: 'white'
  },
}

export default Header
