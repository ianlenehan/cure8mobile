import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import SafariView from 'react-native-safari-view'
import { CustomTabs } from 'react-native-custom-tabs'
import { Icon } from 'react-native-elements'
import Spinner from '../components/common/spinner'
import EmojiButton from '../components/common/emoji-button'
import { ratingValues } from '../../helpers/ratings'

const styles = {
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 2,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    flex: 6,
    fontSize: 16,
  },
  drawerContainer: {
    backgroundColor: 'white',
    paddingTop: 15,
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: 'grey',
  },
  userNames: {
    color: 'grey',
    fontSize: 12,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: 'grey',
  },
  dateAndNamesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cure8Icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
}

class Activity extends Component {
  static navigationOptions = () => {
    return {
      headerTitle: 'Recent Activity',
      tabBarLabel: 'Activity',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="bell-o" type="font-awesome" size={24} color={tintColor} />;
      },
    }
  }

  constructor() {
    super()
    this.ratingValues = ratingValues

    this.state = {
      openDrawerTitle: null,
    }
  }

  getRatingIcon(rating) {
    if (rating.rating) {
      const name = this.ratingValues[rating.rating]
      return (
        <EmojiButton
          name={name}
          render
          style={{ fontSize: 16, marginRight: 5 }}
        />
      )
    }
    return (
      <Image
        style={styles.cure8Icon}
        resizeMode="contain"
        source={require('../../assets/icons/app.png')}
      />
    )
  }

  openInWebBrowser = (url) => {
    if (Platform.OS === 'ios') {
      SafariView.show({
        url,
        tintColor: '#27ae60',
        barColor: '#27ae60',
      })
    } else if (Platform.OS === 'android') {
      CustomTabs.openURL(url)
    }
  }

  openDrawer(item) {
    this.setState({ openDrawerTitle: item.title })
  }

  closeDrawer = () => {
    this.setState({ openDrawerTitle: null })
  }

  renderDate(item) {
    const currentDate = moment()
    const formattedDate = moment(item.created_at).local().from(currentDate)
    return <Text style={styles.date}>{formattedDate}</Text>
  }

  renderDrawer(item) {
    if (this.state.openDrawerTitle === item.title) {
      return (
        <View style={styles.drawerContainer}>
          {
            item.ratings.map(rating => {
              return (
                <View key={rating.user} style={styles.ratingView}>
                  {this.getRatingIcon(rating)}
                  <Text style={styles.ratingText}>{rating.user}</Text>
                </View>
              )
            })
          }
        </View>
      )
    }
    return null
  }

  renderSharedWith(item) {
    if (this.state.openDrawerTitle !== item.title) {
      const names = item.ratings.map(rating => rating.user).join(', ')
      return <Text style={styles.userNames}>{names}</Text>
    }
    return null
  }

  renderMoreIcon(item) {
    const ratingsExist = item.ratings.length > 0
    if (ratingsExist) {
      if (this.state.openDrawerTitle === item.title) {
        return (
          <Icon
            size={32}
            name="expand-less"
            color="#27ae60"
            onPress={this.closeDrawer}
          />
        )
      }
      return (
        <Icon
          size={32}
          name="expand-more"
          color="#27ae60"
          onPress={() => this.openDrawer(item)}
        />
      )
    }
    return null
  }

  renderItems() {
    const { activity } = this.props
    return activity.map((item) => {
      return (
        <View
          key={item.created_at}
          style={styles.container}
        >
          <TouchableOpacity
            style={styles.titleView}
            onPress={() => this.openInWebBrowser(item.url)}
          >
            <Text style={styles.titleText}>{item.title}</Text>
            {this.renderMoreIcon(item)}
          </TouchableOpacity>
          <View style={styles.dateAndNamesView}>
            {this.renderSharedWith(item)}
            {this.renderDate(item)}
          </View>
          {this.renderDrawer(item)}
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
    return (
      <View style={styles.loading}>
        <Spinner size="large" text="Loading recent activity..." />
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => {
  const { activity } = user
  return { activity }
}

export default connect(mapStateToProps, { })(Activity)
