import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

const styles = {
  tagView: {
    padding: 3,
    backgroundColor: '#ccc',
    margin: 4,
    borderRadius: 30,
    marginBottom: 5,
  },
  tag: {
    paddingRight: 6,
    paddingLeft: 6,
    color: 'white',
  },
}

const Tag = (props) => {
  return (
    <TouchableOpacity
      style={[styles.tagView, props.style]}
      key={props.tag}
      onPress={() => props.onPress(props.tag)}
    >
      <Text style={[styles.tag, props.tagStyle]}>
        {props.tag}
      </Text>
    </TouchableOpacity>
  )
}

export default Tag
