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
import { Toast } from 'native-base'
import _ from 'lodash'
import {
  createLink,
  archiveLink,
  shareLink,
  setArchiveMode,
  getLinks,
  addTags
} from '../redux/link/actions'
import { getUserInfo } from '../redux/user/actions'
import Card from './common/card'
import Tag from './common/tag'

class LinkView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      links: [],
      refreshing: false,
      token: null,
      readerMode: 'on',
      filterTerms: [],
      tags: [],
      morePressed: null
    }
  }

  async componentDidMount() {
    this.filterLinks()
    this.checkReaderMode()
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
    this.props.getUserInfo(token)
  }

  componentWillReceiveProps(nextProps) {
    this.checkReaderMode()

    if (nextProps.links && this.props.links) {
      if (!_.isEqual(nextProps.links, this.props.links)) {
        this.filterLinks(nextProps.links)
        this.props.getUserInfo(this.state.token)
      }
    }

    if (nextProps.tags) {
      this.setState({ tags: nextProps.tags })
    }
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.checkReaderMode()
    await this.props.refresh()
    this.setState({ refreshing: false })
  }

  async checkReaderMode() {
    const readerMode = await AsyncStorage.getItem('readerMode')
    if (readerMode) {
      this.setState({ readerMode })
    }
  }

  onSaveLinkPress = () => {
    const { url, link_type, comment, numbers, userPhone } = this.props
    this.props.createLink({ url, link_type, comment, numbers, userPhone })
  }

  onArchivePress = (curation, action) => {
    this.props.setArchiveMode(curation, action)
  }

  async membershipAlert() {
    await AsyncStorage.setItem('limitReached', 'true')
    Toast.show({
      text: "Thanks for trying Cure8! This is the free version of the app and you won't see more than 5 links until you upgrade. You can do this from the profile tab.",
      position: 'bottom',
      buttonText: 'OK',
      type: 'warning',
    })
  }

  async filterLinks(links = this.props.links) {
    const { status, isMember } = this.props
    const filteredByStatus = links.filter((link) => {
      return link.status === status
    })

    const linksCount = filteredByStatus.length
    let allLinks = filteredByStatus
    if (!isMember) {
      allLinks = filteredByStatus.splice(-5)
      // allLinks = filteredByStatus //for local testing
      if (allLinks.length === 5) { this.membershipAlert() }
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

  shareLink(link) {
    const atMaxLinks = this.state.links.length >= 5
    if (!this.props.isMember && atMaxLinks) {
      Alert.alert(
        'Sorry!',
        "Thanks for trying Cure8! You are using the free version of this app and can no longer share or recieve new links. Perhaps you'd like to upgrade to the full version, which you can do from the Profile tab."
      )
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

  addTags = (curationId, tags) => {
    this.props.addTags(curationId, tags, this.state.token)
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
        addTags={this.addTags.bind(this)}
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
  const { isMember } = user
  const { tags } = user.info
  return { archiveMode, links, loading, tags, isMember }
}

export default connect(mapStateToProps, {
  getLinks,
  createLink,
  archiveLink,
  shareLink,
  setArchiveMode,
  getUserInfo,
  addTags
})(LinkView)
