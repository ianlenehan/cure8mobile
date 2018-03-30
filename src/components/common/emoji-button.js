import React from 'react'
import { TouchableWithoutFeedback, Text, View } from 'react-native'
import Emoji from 'react-native-emoji'

const EmojiButton = (props) => {
  console.log('render', props.render)
  if (props.render) {
    return (
      <TouchableWithoutFeedback
        onPress={props.onPress}
      >
        <View>
          <Text style={{ fontSize: 26 }}><Emoji name={props.name} /></Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  return <Text />
}

export default EmojiButton
