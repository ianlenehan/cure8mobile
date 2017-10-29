import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image
} from 'react-native'
import { connect } from 'react-redux'
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
    return activity.map(item => {
      if (item.type === 'rating') {
        return (
          <View key={item.id} style={styles.activityView}>
            {this.getRatingIcon(item)}
            <View>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text>{item.friend}</Text>
            </View>
          </View>
        )
      }
      return (
        <View key={item.id} style={styles.activityView}>
          <Image
            style={{ width: 22, height: 22, borderRadius: 11, margin: 5 }}
            resizeMode='contain'
            source={require('../../assets/icons/app.png')}
          />
        <View>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text>{item.friends.join(', ')}</Text>
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
    fontSize: 18,
  }
}

const mapStateToProps = ({ user }) => {
  const { activity } = user
  return { activity }
}

export default connect(mapStateToProps, { })(Activity)
