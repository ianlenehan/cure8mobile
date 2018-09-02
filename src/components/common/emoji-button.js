import React from 'react'
import { TouchableWithoutFeedback, Text, View } from 'react-native'
import Emoji from '@ardentlabs/react-native-emoji'

const style = {
  fontSize: 26,
}

const EmojiButton = (props) => {
  if (props.render) {
    return (
      <TouchableWithoutFeedback
        onPress={props.onPress}
      >
        <View>
          <Text style={props.style || style}><Emoji name={props.name} /></Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  return <Text />
}

export default EmojiButton
