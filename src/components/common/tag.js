import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text
} from 'react-native'

export default class Tag extends Component {
  render() {

    return (
      <TouchableOpacity
        style={[styles.tagView, this.props.style]}
        key={this.props.tag}
        onPress={() => this.props.onPress(this.props.tag)}
      >
        <Text style={[styles.tag, this.props.tagStyle]}>{this.props.tag}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = {
  tagView: {
    padding: 3,
    backgroundColor: '#ccc',
    margin: 4,
    borderRadius: 30,
    marginBottom: 5
  },
  tag: {
    paddingRight: 6,
    paddingLeft: 6,
    color: 'white',
  }
}
