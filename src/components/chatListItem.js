import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  PanResponder,
  Animated,
  View,
  Text,
  Dimensions,
} from 'react-native'
import moment from 'moment'

const { width } = Dimensions.get('window')

const styles = {
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 10,
    alignItems: 'center',
  },
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  subtitleAndDate: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    paddingTop: 3,
    paddingRight: 5,
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: 'grey',
  },
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

class ChatListItem extends Component {
  constructor(props) {
    super(props)

    this.gestureDelay = -35
    this.scrollViewEnabled = true

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -35) {
          this.setScrollViewEnabled(false)
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
            this.setScrollViewEnabled(true)
          })
        } else {
          Animated.timing(this.state.position, {
            toValue: { x: width, y: 0 },
            duration: -300,
          }).start(() => {
            const deleteOnSwipe = this.shouldDeleteOnSwipe()
            this.props.swipeSuccess(deleteOnSwipe, props.item.id)
            this.setScrollViewEnabled(true)
          })
        }
      },
    })

    this.panResponder = panResponder
    this.state = { position }
  }

  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled)
      this.scrollViewEnabled = enabled
    }
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  shouldDeleteOnSwipe() {
    const { messages, members } = this.props.item
    return messages.length === 0 || members.length === 1
  }

  render() {
    const { item, goToConversation } = this.props
    const deleteOnSwipe = this.shouldDeleteOnSwipe()
    const cellText = deleteOnSwipe ? 'Delete Chat' : 'Leave Chat'
    const cellColour = deleteOnSwipe ? 'red' : 'orange'
    const cellTextColour = deleteOnSwipe ? 'white' : 'black'
    return (
      <View style={[styles.listItem, { backgroundColor: cellColour }]}>
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.innerCell}>
            <TouchableWithoutFeedback onPress={() => goToConversation(item)}>
              <View style={styles.details}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.title || ''}</Text>
                  {item.unread_messages > 0 ? (
                    <View style={styles.unreadContainer}>
                      <Text style={styles.unreadCount}>{item.unread_messages}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.subtitleAndDate}>
                  <Text style={styles.subtitle}>{item.members.join(', ')}</Text>
                  <Text style={styles.subtitle}>{this.formatDate(item.updated_at)}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.absoluteCell}>
            <Text style={{ color: cellTextColour, fontWeight: 'bold' }}>{cellText}</Text>
          </View>
        </Animated.View>
      </View>
    )
  }
}

export default ChatListItem
