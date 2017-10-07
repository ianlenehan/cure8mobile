import React, { Component } from 'react'
import {
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'

import { createLink, archiveLink, shareLink, setArchiveMode, getLinks } from '../redux/link/actions'
import Card from './common/card'

class LinkView extends Component {
  state = { links: [], refreshing: false, token: null, readerMode: 'on' }

  async componentDidMount() {
    this.filterLinks()
    this.checkReaderMode()
    const token = await AsyncStorage.getItem('token')
    this.setState({ token })
  }

  componentWillReceiveProps(nextProps) {
    this.filterLinks(nextProps.links)
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

  filterLinks(links = this.props.links) {
    const { status } = this.props
    const filtered = links.filter((link) => {
      return link.status === status
    })

    this.setState({ links: filtered })
  }

  archiveLink = (curation, rating) => {
    const { action } = this.props.archiveMode
    this.props.archiveLink(curation, rating, action, this.state.token)
    this.onArchivePress(null)
  }

  deleteArchivedLink = (curation, rating) => {
    this.props.archiveLink(curation, rating, 'deleted', this.state.token)
  }

  shareLink(link) {
    this.props.navigate('addLink', { url: link.url })
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
        delete={this.deleteArchivedLink.bind(this)}
        loading={this.props.loading}
        readerMode={this.state.readerMode}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
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

const mapStateToProps = ({ link }) => {
  const { archiveMode, links, loading } = link
  return { archiveMode, links, loading }
}

export default connect(mapStateToProps, {
  getLinks, createLink, archiveLink, shareLink, setArchiveMode
})(LinkView)
