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
        reverse={props.reverse || false}
        raised={props.raised || false}
      />
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </View>
  )
}

export default MyIcon

const styles = {
  text: {
    fontSize: 8,
    color: 'grey',
  },
}
