import React from 'react'
import { TouchableWithoutFeedback, Text, View } from 'react-native'
import Emoji from '@ardentlabs/react-native-emoji'

const EmojiButton = (props) => {
  if (props.render) {
    return (
      <TouchableWithoutFeedback
        onPress={props.onPress}
      >
        <View>
          <Text style={{ fontSize: props.size || 26 }}><Emoji name={props.name} /></Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  return <Text />
}

export default EmojiButton
