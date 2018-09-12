import React, { Component } from 'react'
import {
  View,
  Animated,
  Text,
  Dimensions,
  PanResponder,
} from 'react-native'

const { width } = Dimensions.get('window')

const styles = {
  listItem: {
    marginRight: -100,
    justifyContent: 'center',
  },
  absoluteCell: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  absoluteCellText: {
    fontWeight: 'bold',
  },
  innerCell: {
    width,
    marginRight: 100,
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
}

class Swipe extends Component {
  constructor(props) {
    super(props)

    this.gestureDelay = 35

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx !== 0 && gestureState.dy !== 0
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -15) {
          this.props.setScrollViewEnabled(false)
          const newX = gestureState.dx + this.gestureDelay
          position.setValue({ x: newX, y: 0 })
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > -150) {
          Animated.timing(this.state.position, {
            toValue: { x: 0, y: 0 },
            duration: -150,
          }).start(() => {
            this.props.setScrollViewEnabled(true)
          })
        } else {
          Animated.timing(this.state.position, {
            toValue: { x: width, y: 0 },
            duration: -300,
          }).start(() => {
            this.props.swipeSuccess()
            this.props.setScrollViewEnabled(true)
          })
        }
      },
    })

    this.panResponder = panResponder
    this.state = { position }
  }

  render() {
    return (
      <View style={[styles.listItem, { backgroundColor: this.props.cellColour }]}>
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.innerCell}>
            {this.props.children}
          </View>
          <View style={styles.absoluteCell}>
            <Text style={{ color: this.props.textColour, fontWeight: 'bold' }}>{this.props.text}</Text>
          </View>
        </Animated.View>
      </View>
    )
  }
}

export default Swipe
