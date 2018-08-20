import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
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
    padding: 5,
  },
  ratingText: {
    color: 'grey',
  },
  cure8Icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 5,
  },
  date: {
    fontSize: 8,
    color: 'grey',
    flex: 1,
    textAlign: 'right',
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
          size={16}
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

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
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
    if (item.ratings.length === 0) {
      Alert.alert('Nothing to See', "We've no activity to show you here, looks like you haven't curated this link for anyone.")
    } else {
      this.setState({ openDrawerTitle: item.title })
    }
  }

  closeDrawer = () => {
    this.setState({ openDrawerTitle: null })
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

  renderMoreIcon(item) {
    const ratingsExist = item.ratings.length > 0
    if (this.state.openDrawerTitle === item.title && ratingsExist) {
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
