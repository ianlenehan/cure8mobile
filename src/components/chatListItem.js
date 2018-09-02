import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'
import moment from 'moment'

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
}

class ChatListItem extends Component {
  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  render() {
    const { item, goToConversation } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => goToConversation(item)}>
        <View style={styles.card}>
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
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default ChatListItem
