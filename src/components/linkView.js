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
  Platform,
  NativeModules,
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
import { getUserInfo, updateUser } from '../redux/user/actions'
import Card from './common/card'
import Tag from './common/tag'

class LinkView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      links: [],
      token: null,
      readerMode: 'on',
      filterTerms: [],
      tags: [],
      morePressed: null,
      isMember: true,
    }
  }

  async componentDidMount() {
    const membership = await AsyncStorage.getItem('membership')
    const token = await AsyncStorage.getItem('token')
    this.setState({ isMember: !!membership, token })
    this.filterLinks()
    this.checkReaderMode()
    this.props.getUserInfo(token)
    if (!membership && this.props.links.length === 5 && !__DEV__) {
      this.membershipAlert()
    }
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

    if (nextProps.userInfo.subscription_type) {
      this.setState({ isMember: true })
    }
  }

  async onRefresh() {
    await this.checkReaderMode()
    await this.props.refresh()
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

  restorePurchase = () => {
    if (this.state.isMember) {
      AsyncStorage.setItem('subscriptionType', 'unlimited')
    } else {
      NativeModules.InAppUtils.restorePurchases((error, response) => {
        if(error) {
          Alert.alert('iTunes Error', 'Could not connect to iTunes store.')
        } else {
          Alert.alert('Restore Successful', 'Successfully restored your purchase.')

          if (response.length === 0) {
            Alert.alert('No Purchases', "We couldn't find any purchases to restore.")
            return
          }

          response.forEach(async (purchase) => {
            if (purchase.productIdentifier === 'com.cure8.cure8app.premium') {
              await this.props.updateUser(this.state.token, 'unlimited', 'subscription_type', this.props.userInfo)
              await AsyncStorage.setItem('subscriptionType', 'unlimited')
              await AsyncStorage.removeItem('limitReached')
              this.props.getLinks(this.state.token)
              this.setState({ isMember: true })
            }
          })
        }
      })
    }
  }

  async membershipAlert() {
    await AsyncStorage.setItem('limitReached', 'true')
    Alert.alert(
      'Sorry!',
      "Thanks for trying Cure8! You are using the free version of this app and can no longer share or recieve new links. Perhaps you'd like to upgrade to the full version, which you can do from the Settings screen. Or tap Restore below if you have already purchased.",
      [
        {text: 'OK'},
        {text: 'Restore', onPress: () => this.restorePurchase()},
      ]
    )
  }

  filterLinks(links = this.props.links, userInfo = this.props.userInfo) {
    const { status } = this.props
    const sortedLinks = this.sortLinks(links)
    const filteredByStatus = sortedLinks.filter((link) => {
      return link.status === status
    })

    const linksCount = filteredByStatus.length
    let allLinks = filteredByStatus

    let res = allLinks
    if (this.state.filterTerms.length) {
      res = this.filterByTags(allLinks)
    }
    this.setState({ links: res })
  }

  sortLinks(links) {
    return links.sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added)
    })
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
    if (!this.state.isMember && atMaxLinks && !__DEV__) {
      this.membershipAlertDialog()
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
      const tagColour = filterTerms.includes(tag) ? '#27ae60' : '#fff'
      const fontColour = filterTerms.includes(tag) ? '#fff' : '#27ae60'
      return (
        <Tag
          key={tag}
          tag={tag}
          onPress={this.filterByTag.bind(this)}
          style={{ backgroundColor: tagColour, borderColor: fontColour, borderWidth: 1 }}
          tagStyle={{ color: fontColour }}
        />
      )
    })
  }

  expandCardDrawer = (curation) => {
    this.setState({ morePressed: curation })
  }

  resetLinks = async () => {
    await this.setState({ filterTerms: [] })
    this.filterLinks()
  }

  addTags = (curationId, tags) => {
    this.props.addTags(curationId, tags, this.state.token)
  }

  renderTagFilterList = () => {
    if (this.props.status === 'archived' && this.props.tags && this.props.tags.length) {
      return (
        <View style={styles.tagList}>
          <ScrollView horizontal style={{ borderWidth: 0 }}>
            {this.filterTagList()}
          </ScrollView>
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name='cancel'
            color='#ddd'
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
        userPhone={this.props.userInfo.phone}
        navigate={this.props.navigate}
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
          keyExtractor={item => item.curation_id.toString()}
          removeClippedSubviews={false}
          archiveMode={this.props.archiveMode}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
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
  tagList: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  }
}

const mapStateToProps = ({ link, user }) => {
  const { archiveMode, links, loading } = link
  const { info: userInfo } = user
  const { tags } = user.info
  return { archiveMode, links, loading, tags, userInfo }
}

export default connect(mapStateToProps, {
  getLinks,
  createLink,
  archiveLink,
  shareLink,
  setArchiveMode,
  getUserInfo,
  addTags,
  updateUser,
})(LinkView)
