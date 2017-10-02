import React, { Component } from 'react'
import { AsyncStorage, Text, View } from 'react-native'
import { connect } from 'react-redux'

import { getLinks } from '../redux/link/actions'
import LinkView from '../components/linkView'
import Spinner from '../components/common/spinner'

class OldLinks extends Component {
  static navigationOptions = () => {
    return {
      headerTitle: 'Archived Links',
      headerTitleStyle: styles.headerTitle
    }
  }

  async getUserData() {
    const token = await AsyncStorage.getItem('token')
    this.props.getLinks(token)
  }

  render() {
    const { loading, links } = this.props
    if (!links) {
      if (loading) {
        return (
          <View style={styles.loading}>
            <Spinner size='large' text='Loading archived links...' />
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
        status='archived'
        navigate={this.props.navigation.navigate}
        refresh={this.getUserData.bind(this)}
      />
    )
  }
}

const styles = {
  noLinks: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTitle: {}
}

const mapStateToProps = ({ link }) => {
  const { links, loading } = link
  return { links, loading }
}

export default connect(mapStateToProps, { getLinks })(OldLinks)
