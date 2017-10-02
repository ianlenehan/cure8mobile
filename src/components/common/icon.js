import React from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

const MyIcon = (props) => {
  return (
    <View>
      <Icon
        size={props.size}
        name={props.name}
        color={props.color}
        onPress={props.onPress}
        type={props.type}
      />
      <Text style={styles.text}>{props.text}</Text>
    </View>
  )
}

export default MyIcon

const styles = {
  text: {
    fontSize: 8,
    color: 'grey'
  }
}
