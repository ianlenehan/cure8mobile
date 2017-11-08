import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  StatusBar,
  FlatList,
  RefreshControl,
  AsyncStorage,
  Alert,
  Platform
} from 'react-native'
import { connect } from 'react-redux'

import { createLink, archiveLink, shareLink, setArchiveMode, getLinks } from '../redux/link/actions'
import Card from './common/card'
import Tag from './common/tag'

class LinkView extends Component {
  state = { links: [], refreshing: false, token: null, readerMode: 'on', membership: null }

  async componentDidMount() {
    this.filterLinks()
    this.checkReaderModeAndMembership()
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  componentWillReceiveProps(nextProps) {
    this.checkReaderModeAndMembership()
    this.filterLinks(nextProps.links)
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.checkReaderModeAndMembership()
    await this.props.refresh()
    this.setState({ refreshing: false })
  }

  async checkReaderModeAndMembership() {
    const readerMode = await AsyncStorage.getItem('readerMode')
    const membership = await AsyncStorage.getItem('membership')
    if (readerMode) {
      this.setState({ readerMode, membership })
    } else {
      this.setState({ membership })
    }
  }

  onSaveLinkPress = () => {
    const { url, link_type, comment, numbers, userPhone } = this.props
    this.props.createLink({ url, link_type, comment, numbers, userPhone })
  }

  onArchivePress = (curation, action) => {
    this.props.setArchiveMode(curation, action)
  }

  membershipAlert() {
    Alert.alert('Free Trial', "Thank you for trying Cure8! You have reached the limit for the free version of this app. If you've enjoyed using the app, please consider upgrading from the profile tab. If you have previously upgraded to the full version of this app, you can restore your purchase from the profile tab by tapping on the question mark.")
  }

  async filterLinks(links = this.props.links) {
    const { status } = this.props
    const filtered = links.filter((link) => {
      return link.status === status
    })

    const linksCount = filtered.length
    let allLinks = filtered

    const membership = await AsyncStorage.getItem('membership')
    const membershipAlert = await AsyncStorage.getItem('membershipAlert')
    const isIOS = Platform.OS === 'ios'
    if (!membership && isIOS) {
      allLinks = filtered.splice(-5)
      if (linksCount >= 5 && !membershipAlert) {
        this.membershipAlert()
        await AsyncStorage.multiSet([
          ['membershipAlert', 'yes'],
          ['limitReached', 'yes'],
        ])
      }
    }
    this.setState({ links: allLinks })
  }

  archiveLink = (id, rating, tags = []) => {
    const { action } = this.props.archiveMode
    const { token } = this.state
    this.props.archiveLink({ id, rating, action, token, tags })
    this.onArchivePress(null)
  }

  archiveWithoutRating = (curation, rating, action) => {
    this.props.archiveLink(curation, rating, action, this.state.token)
  }

  async shareLink(link) {
    const membershipAlert = await AsyncStorage.getItem('membershipAlert')
    const membership = await AsyncStorage.getItem('membership')

    if (!membership && Platform.OS == 'ios' && membershipAlert === 'yes') {
      this.membershipAlert()
    } else {
      this.props.navigate('addLink', { url: link.url })
    }
  }

  renderTagFilterList = () => {
    if (this.props.status === 'archived') {
      return this.props.tags.map(tag => {
        return (
          <Tag key={tag} tag={tag }/>
        )
      })
    }
  }

  renderItem = ({ item }) => {
    return (
      <Card
        link={item}
        onArchivePress={this.onArchivePress.bind(this)}
        onSharePress={(link) => this.shareLink(link)}
        status={this.props.status}
        archiveMode={this.props.archiveMode}
        archiveLink={this.archiveLink.bind(this)}
        justArchive={this.archiveWithoutRating.bind(this)}
        loading={this.props.loading}
        readerMode={this.state.readerMode}
        tags={this.props.tags}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              horizontal
              >
              {this.renderTagFilterList()}
            </ScrollView>
          </View>
        <FlatList
          data={this.state.links}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={item => item.curation_id}
          removeClippedSubviews={false}
          archiveMode={this.props.archiveMode}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        />
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1'
  },
  links: {
    alignItems: 'center',
  },
  noLinks: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    opacity: 0.8,
    backgroundColor: 'transparent'
  }
}

const mapStateToProps = ({ link, user }) => {
  const { archiveMode, links, loading } = link
  const { tags } = user.info
  return { archiveMode, links, loading, tags }
}

export default connect(mapStateToProps, {
  getLinks, createLink, archiveLink, shareLink, setArchiveMode
})(LinkView)
