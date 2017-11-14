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
import { Icon } from 'react-native-elements'
import _ from 'lodash'
import { createLink, archiveLink, shareLink, setArchiveMode, getLinks } from '../redux/link/actions'
import { getUserInfo } from '../redux/user/actions'
import Card from './common/card'
import Tag from './common/tag'

class LinkView extends Component {
  state = {
    links: [],
    refreshing: false,
    token: null,
    readerMode: 'on',
    membership: null,
    filterTerms: [],
    tags: [],
    morePressed: null
  }

  async componentDidMount() {
    this.filterLinks()
    this.checkReaderModeAndMembership()
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  componentWillReceiveProps(nextProps) {
    this.checkReaderModeAndMembership()
    this.filterLinks(nextProps.links)

    if (nextProps.links && this.props.links) {
      if (!_.isEqual(nextProps.links, this.props.links)) {
        this.props.getUserInfo(this.state.token)
      }
    }

    if (nextProps.tags) {
      this.setState({ tags: nextProps.tags })
    }
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
    const filteredByStatus = links.filter((link) => {
      return link.status === status
    })

    const linksCount = filteredByStatus.length
    let allLinks = filteredByStatus

    const membership = await AsyncStorage.getItem('membership')
    const membershipAlert = await AsyncStorage.getItem('membershipAlert')
    const isIOS = Platform.OS === 'ios'
    if (!membership && isIOS) {
      allLinks = filteredByStatus.splice(-5)
      // allLinks = filtered //for local testing
      if (linksCount >= 5 && !membershipAlert) {
        this.membershipAlert()
        await AsyncStorage.multiSet([
          ['membershipAlert', 'yes'],
          ['limitReached', 'yes'],
        ])
      }
    }
    let res = allLinks
    if (this.state.filterTerms.length) {
      res = this.filterByTags(allLinks)
    }
    this.setState({ links: res })
  }

  archiveLink = (id, rating, tags = []) => {
    const { action } = this.props.archiveMode
    const { token } = this.state
    this.props.archiveLink({ id, rating, action, token, tags })
    this.onArchivePress(null)
  }

  archiveWithoutRating = (id, rating, action) => {
    const { token } = this.state
    this.props.archiveLink({ id, rating, action, token })
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

  filterByTag = async (tag) => {
    const { filterTerms } = this.state
    let newFilterTerms = [tag, ...filterTerms]
    if (filterTerms.includes(tag)) {
      newFilterTerms = filterTerms.filter(term => term !== tag)
    }
    await this.setState({ filterTerms: newFilterTerms })
    this.filterLinks()
  }

  filterByTags(links) {
    const { filterTerms } = this.state

    const mappedLinks = links.map(link => {
      const tags = link.tags.map(tag => tag.name)

      const filteredLinks = filterTerms.every(term => {
        return tags.includes(term)
      })
      if (filteredLinks) { return link }
    })

    return mappedLinks.filter(mappedLink => !!mappedLink)
  }

  filterTagList() {
    const { filterTerms } = this.state
    const tags = this.props.tags.sort()
    return tags.map(tag => {
      const tagColour = filterTerms.includes(tag) ? '#27ae60' : '#ccc'
      return (
        <Tag
          key={tag}
          tag={tag}
          onPress={this.filterByTag.bind(this)}
          style={{ backgroundColor: tagColour }}
        />
      )
    })
  }

  expandCardDrawer = (curation) => {
    this.setState({ morePressed: curation })
  }

  resetLinks = () => {
    this.setState({ filterTerms: [] })
    this.filterLinks()
  }

  renderTagFilterList = () => {
    if (this.props.status === 'archived') {
      return (
        <View style={styles.tagList}>
          <ScrollView horizontal>
            {this.filterTagList()}
          </ScrollView>
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name='cancel'
            color='#ccc'
            onPress={this.resetLinks}
            />
        </View>
      )
    }
  }

  renderItem = ({ item }) => {
    return (
      <Card
        link={item}
        morePressed={this.state.morePressed}
        onDrawerPress={(curation) => this.expandCardDrawer(curation)}
        onArchivePress={this.onArchivePress.bind(this)}
        onSharePress={(link) => this.shareLink(link)}
        status={this.props.status}
        archiveMode={this.props.archiveMode}
        archiveLink={this.archiveLink.bind(this)}
        justArchive={this.archiveWithoutRating.bind(this)}
        loading={this.props.loading}
        readerMode={this.state.readerMode}
        tags={this.state.tags}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.renderTagFilterList()}
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
  },
  tagList: {
    backgroundColor: 'white',
    flexDirection: 'row'
  }
}

const mapStateToProps = ({ link, user }) => {
  const { archiveMode, links, loading } = link
  const { tags } = user.info
  return { archiveMode, links, loading, tags }
}

export default connect(mapStateToProps, {
  getLinks, createLink, archiveLink, shareLink, setArchiveMode, getUserInfo
})(LinkView)
