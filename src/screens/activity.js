import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  Alert
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import SafariView from 'react-native-safari-view'
import { CustomTabs } from 'react-native-custom-tabs'
import { Icon, Button } from 'react-native-elements'

class Activity extends Component {
  static navigationOptions = () => {
    return {
      headerTitle: 'Recent Activity',
      tabBarLabel: 'Activity',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="bell-o" type="font-awesome" size={24} color={tintColor} />;
      }
    }
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  openInWebBrowser = (url) => {
    if (Platform.OS === 'ios') {
      SafariView.show({
        url,
        tintColor: '#27ae60',
        barColor: '#27ae60'
      })
    } else if (Platform.OS === 'android') {
      CustomTabs.openURL(url)
    }
  }

  getRatingIcon(item) {
    if (item.rating ==='1') {
      return (
        <Icon
          size={22}
          containerStyle={{ margin: 5 }}
          name='thumb-up'
          color='#3498db'
        />
      )
    }
    return (
      <Icon
        size={22}
        containerStyle={{ margin: 5 }}
        name='thumb-down'
        color='#e67e22'
      />
    )
  }

  renderItems() {
    const { activity } = this.props
    return activity.map((item, i) => {
      if (item.type === 'rating') {
        return (
          <TouchableOpacity
            key={i}
            style={styles.activityView}
            onPress={() => this.openInWebBrowser(item.url)}
          >
            {this.getRatingIcon(item)}
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>{item.title.trim()}</Text>
              <View style={styles.bottomText}>
                <Text style={styles.friendName}>{item.friend}</Text>
                <Text style={styles.date}>{this.formatDate(item.date)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }
      return (
        <View key={i} style={styles.activityView}>
          <Image
            style={{ width: 22, height: 22, borderRadius: 11, margin: 5 }}
            resizeMode='contain'
            source={require('../../assets/icons/app.png')}
          />
        <View style={{ flex: 1 }}>
          <Text style={styles.activityTitle}>{item.title.trim()}</Text>
            <View style={styles.bottomText}>
              <Text style={styles.friendName}>{item.friends.join(', ')}</Text>
              <Text style={styles.date}>{this.formatDate(item.date)}</Text>
            </View>
        </View>
        </View>
      )
    })
  }

  render() {
    if (this.props.activity.length) {
      return (
        <ScrollView>
          {this.renderItems()}
        </ScrollView>
      )

    }
  }
}

const styles = {
  activityView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 0.5,
    marginTop: 0.5,
    borderRadius: 2,
    borderColor: '#ccc',
    borderBottomWidth: 0,
    padding: 3,
    paddingRight: 10,
    alignItems: 'center'
  },
  activityTitle: {
    fontSize: 14,
  },
  friendName: {
    fontSize: 10,
    flex: 2
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 3,
    alignItems: 'flex-end'
  },
  date: {
    fontSize: 8,
    color: 'grey',
    flex: 1,
    textAlign: 'right',
  },
}

const mapStateToProps = ({ user }) => {
  const { activity } = user
  return { activity }
}

export default connect(mapStateToProps, { })(Activity)
