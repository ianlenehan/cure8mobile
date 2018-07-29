import React, { Component } from 'react'
import { AsyncStorage, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'

import { getLinks } from '../redux/link/actions'
import LinkView from '../components/linkView'
import Spinner from '../components/common/spinner'

const styles = {
  noLinks: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    borderColor: '#fff',
    borderWidth: 2,
  },
}

class OldLinks extends Component {
  static navigationOptions = () => {
    return {
      tabBarLabel: 'Archived',
      headerTitle: 'Archived Links',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="archive" size={24} color={tintColor} />
      },
    }
  }

  state = { cachedLinks: null, token: null }

  componentDidMount() {
    this._loadStoredData()
    this.getUserData()
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
    this.props.getLinks(token)
  }

  async _loadStoredData() {
    const links = await AsyncStorage.getItem('cachedArchivedLinks')
    this.setState({ cachedLinks: JSON.parse(links) })
  }

  render() {
    const { loading } = this.props
    const links = this.props.archivedLinks || this.state.cachedLinks
    if (!links) {
      if (loading) {
        return (
          <View style={styles.loading}>
            <Spinner size="large" text="Loading archived links..." />
          </View>
        )
      }
      return (
        <View style={styles.noLinks}>
          <Text>You have no archived links to show.</Text>
        </View>
      )
    }
    return (
      <LinkView
        status="archived"
        navigate={this.props.navigation.navigate}
        refresh={this.getUserData}
        links={links}
        token={this.state.token}
      />
    )
  }
}

const mapStateToProps = ({ link }) => {
  const { archivedLinks, loading } = link
  return { archivedLinks, loading }
}

export default connect(mapStateToProps, { getLinks })(OldLinks)
