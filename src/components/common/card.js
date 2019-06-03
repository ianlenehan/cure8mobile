import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  Alert,
  LayoutAnimation,
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import swearjar from 'swearjar'
import { Icon, Button } from 'react-native-elements'
import SafariView from 'react-native-safari-view'
import { CustomTabs } from 'react-native-custom-tabs'
import Title from './title'
import MyIcon from './icon'
import Tag from './tag'
import CardSection from './cardSection'
import Spinner from './spinner'
import Input from './input'
import RatingIcons from './ratingIcons'
import { createConversation, getConversations } from '../../redux/conversation/actions'
import { primaryGreen } from '../../variables'

const styles = {
  title: {
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: 200,
    paddingBottom: 5,
  },
  placeholderImage: {
    height: 200,
    width: 400,
  },
  subtitle: {
    flexDirection: 'row',
    margin: 5,
  },
  date: {
    fontSize: 8,
    color: 'grey',
    flex: 1,
    textAlign: 'right',
  },
  owner: {
    fontSize: 10,
    color: 'black',
    textAlign: 'left',
    paddingRight: 10,
  },
  count: {
    fontSize: 10,
    color: primaryGreen,
  },
  comment: {
    fontSize: 12,
    color: 'grey',
    margin: 5,
    flex: 4,
  },
  note: {
    fontSize: 12,
    color: 'grey',
    margin: 5,
  },
  noteView: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    padding: 5,
  },
  icon: {
    flexDirection: 'row',
    flex: 0.5,
    paddingRight: 10,
    justifyContent: 'flex-end',
  },
  ratings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 5,
    paddingTop: 5,
  },
  smallTag: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  smallTagStyle: {
    fontSize: 10,
    color: '#ccc',
  },
  updateTagsButton: {
    marginBottom: 10,
    width: 150,
    padding: 8,
    borderRadius: 5,
  },
}

class Card extends Component {
  constructor(props) {
    super(props)
    const sharedWithNames = props.link.users_shared_with.map(u => u.phone)

    this.state = {
      phone: null,
      tags: [],
      selectedTags: [],
      tagSearchQuery: '',
      sharedWithNames,
    }
  }

  componentDidMount() {
    this._setTags()
    if (this.props.contacts.length > 0 && this.props.userPhone) {
      this.getSharedWithNames(this.props.contacts, this.props.userPhone)
    } 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags && nextProps.tags.length) {
      const tags = nextProps.tags.sort()
      this.setState({ tags })
    }
    if (nextProps.userPhone) {
      this.setState({ phone: this.props.userPhone })
    }
    if (nextProps.contacts.length > 0 && nextProps.userPhone) {
      this.getSharedWithNames(nextProps.contacts, nextProps.userPhone)
    }
  }

  onArchivePress(owner, curation, action) {
    if (owner.name === 'Cure8') {
      Alert.alert('Sample Link', 'As this is a sample link, it\'s not something you can delete or archive. Add your own links and this one will go away!')
    } else if (owner.phone === this.state.phone && action === 'deleted') {
      this.props.justArchive(curation, 1, action)
    } else {
      this.props.onArchivePress(curation, action)
    }
  }

  getSharedWithNames(contacts, phone) {
    const { users_shared_with: usersSharedWith } = this.props.link
    const sharedWithNames = usersSharedWith.map(user => {
      const userContactMatch = contacts.filter(contact => contact.user_id === user.id)
      if (userContactMatch.length > 0) return userContactMatch[0].name
      return user.phone
    })
    const index = sharedWithNames.indexOf(phone)
    if (index > -1) sharedWithNames.splice(index, 1)
    this.setState({ sharedWithNames })
  }

  toggleTag = (tag) => {
    const { selectedTags } = this.state
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter(selectedTag => {
        return selectedTag !== tag
      })
      this.setState({ selectedTags: newTags })
    } else {
      this.setState({ selectedTags: [...selectedTags, tag] })
    }
  }

  addTagInput = () => {
    const { archiveMode, status } = this.props
    if (archiveMode.action === 'archived' || status === 'archived') {
      return (
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <Input
              placeholder="type to add new tag and then press '+'"
              style={{ flex: 1, fontSize: 12, height: 30 }}
              onChangeText={this.tagSearch}
              value={this.state.tagSearchQuery}
              autoCapitalize="none"
            />
            <Icon
              color="#27ae60"
              reverse
              name="plus"
              type="font-awesome"
              onPress={this.addNewTag}
              size={12}
            />
          </View>
          {this.renderUpdateButton(status)}
        </View>
      )
    }
    return null
  }

  tagSearch = (query) => {
    this.setState({ tagSearchQuery: query })
  }

  addNewTag = () => {
    const { tags, selectedTags, tagSearchQuery } = this.state
    const cleanTag = tagSearchQuery.toLowerCase().trim()
    if (cleanTag.length) {
      if (swearjar.profane(cleanTag)) {
        Alert.alert(
          'Oops',
          "Let's keep this clean, we might use tags publicy in a later release.",
          [{ text: 'Sorry' }],
        )
      } else if (tags.includes(cleanTag)) {
        this.setState({ selectedTags: [...selectedTags, cleanTag] })
      } else {
        this.setState({
          selectedTags: [...selectedTags, cleanTag],
          tags: [cleanTag, ...tags],
        })
      }
      this.tagSearch('')
    }
  }

  _isAlertNecessary() {
    const { owner, shared_with: sharedWith, users_shared_with: usersSharedWith } = this.props.link
    if (owner.phone === this.state.phone) return false

    if (sharedWith >= 2) { return true }

    const userIds = usersSharedWith.map(user => user.id)
    const ownerSharedWithThemself = userIds.includes(owner.id)
    if (sharedWith === 2 && ownerSharedWithThemself) { return true }

    return false
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  async startConversation(chatType) {
    const { title, link_id, users_shared_with: users } = this.props.link
    const { token } = this.props
    const userIds = users.map(user => user.id)

    await this.props.createConversation({ link_id, userIds, chatType, token })
    this.props.getConversations(token)
    this.props.navigate('chat', { title })
  }

  expandLess = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.props.onDrawerPress(null)
    this.props.onArchivePress(null)
  }

  expandMore = async (curation) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const expandMoreAlerted = await AsyncStorage.getItem('expandMoreAlerted')
    if (!expandMoreAlerted) {
      Alert.alert('How does this work?', 'Pressing on Delete or Archive will ask you to rate the curation for your friend. Add a tag when Archiving if you wish, and then press the Thumbs Up or any other emoji to finish deleting or archiving the curation.')
      await AsyncStorage.setItem('expandMoreAlerted', 'alerted')
    }
    this.props.onDrawerPress(curation)
  }

  conversationAlert() {
    const { name: ownerName, phone } = this.props.link.owner
    if (this._isAlertNecessary()) {
      Alert.alert(
        'Chat',
        `Select a one on one chat with ${ownerName} or start a group chat with everyone they curated this for.`,
        [
          { text: '1-on-1', onPress: () => this.startConversation('single') },
          { text: 'Group', onPress: () => this.startConversation('group') },
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        ],
      )
    } else if (phone === this.state.phone) {
      this.startConversation('group')
    } else {
      this.startConversation('single')
    }
  }

  openInWebBrowser = (url) => {
    const readerMode = this.props.readerMode === 'on'
    if (Platform.OS === 'ios') {
      SafariView.show({
        url,
        readerMode,
        tintColor: '#27ae60',
        barColor: '#27ae60',
      })
    } else if (Platform.OS === 'android') {
      CustomTabs.openURL(url)
    }
  }

  _setTags() {
    if (this.props.link.status === 'archived') {
      const tags = this.props.link.tags.map(tag => tag.name)
      this.setState({ selectedTags: [...tags, ...this.state.selectedTags] })
    }
  }

  showSharedWith = () => {
    const { sharedWithNames } = this.state
    if (sharedWithNames) {
      let message = 'This has only been shared with with you.'
      if (sharedWithNames.length) {
        message = `This has also been shared with ${sharedWithNames.join(', ')}.`
      }
      Alert.alert('Shared With', message)
    }
  }

  renderUpdateButton(status) {
    const { curation_id } = this.props.link
    const { selectedTags } = this.state
    if (status === 'archived') {
      return (
        <Button
          title="Update tags"
          backgroundColor="#27ae60"
          buttonStyle={styles.updateTagsButton}
          fontSize={12}
          onPress={() => this.props.addTags(curation_id, selectedTags)}
        />
      )
    }
    return null
  }

  renderTags = () => {
    const { tags, selectedTags } = this.state
    const { archiveMode, status } = this.props
    if (tags && (archiveMode.action === 'archived' || status === 'archived')) {
      return tags.map(tag => {
        const tagColour = selectedTags.includes(tag) ? '#27ae60' : '#ccc'
        return (
          <Tag
            style={{ backgroundColor: tagColour }}
            onPress={this.toggleTag}
            tag={tag}
            key={tag}
          />
        )
      })
    }
    return null
  }

  renderMoreIcon(curation) {
    if (this.props.morePressed === curation) {
      return (
        <View style={styles.icon}>
          <Icon
            size={32}
            name="expand-less"
            color="#27ae60"
            onPress={this.expandLess}
          />
        </View>
      )
    }
    return (
      <View style={styles.icon}>
        <Icon
          size={32}
          name="expand-more"
          color="#27ae60"
          onPress={() => this.expandMore(curation)}
        />
      </View>
    )
  }

  renderMainIcons(curation, owner, rating) {
    if (this.props.status === 'new' && this.props.morePressed === curation) {
      if (this.props.loading || this.props.conversationLoading) {
        return <Spinner size="small" />
      }
      return (
        <View style={styles.icons}>
          <MyIcon
            size={24}
            name="delete"
            color="#27ae60"
            onPress={() => this.onArchivePress(owner, curation, 'deleted')}
            text="Delete"
          />
          <MyIcon
            size={24}
            name="archive"
            color="#27ae60"
            onPress={() => this.onArchivePress(owner, curation, 'archived')}
            text="Archive"
          />
          {this.renderConversationIcon()}
          <MyIcon
            size={24}
            type="font-awesome"
            name="share"
            color="#27ae60"
            onPress={() => this.props.onSharePress(this.props.link)}
            text="Share"
          />
        </View>
      )
    } else if (this.props.morePressed === curation) {
      if (this.props.loading || this.props.conversationLoading) {
        return <Spinner size="small" />
      }
      return (
        <View>
          <View style={styles.icons}>
            <MyIcon
              size={24}
              name="delete"
              color="#27ae60"
              onPress={() => this.props.justArchive(curation, rating, 'deleted')}
              text="Delete"
            />
            {this.renderConversationIcon()}
            <MyIcon
              size={24}
              type="font-awesome"
              name="share"
              color="#27ae60"
              onPress={() => this.props.onSharePress(this.props.link)}
              text="Share"
            />
          </View>
          <View style={styles.tagContainer}>
            <ScrollView
              style={{ flex: 1 }}
              horizontal
            >
              {this.renderTags()}
            </ScrollView>
          </View>
          {this.addTagInput()}
        </View>
      )
    }
    return null
  }

  renderConversationIcon() {
    const { shared_with: sharedWith } = this.props.link

    if (sharedWith > 0) {
      return (
        <MyIcon
          size={24}
          name="comment"
          type="font-awesome"
          color="#27ae60"
          onPress={() => this.conversationAlert()}
          text="Discuss"
        />
      )
    }
    return null
  }

  renderAllIcons(owner) {
    return owner.phone !== this.state.phone
  }

  renderIcons(curation, owner, rating) {
    const { archiveMode } = this.props
    const { selectedTags } = this.state
    const renderAll = this.renderAllIcons(owner, curation)
    if (archiveMode.curation === curation) {
      return (
        <RatingIcons
          renderTags={this.renderTags}
          curation={curation}
          addTagInput={this.addTagInput}
          archiveLink={this.props.archiveLink}
          owner={owner}
          selectedTags={selectedTags}
          renderAllIcons={renderAll}
          onArchivePress={this.props.onArchivePress}
        />
      )
    }
    return this.renderMainIcons(curation, owner, rating)
  }

  renderImage(image) {
    if (image) {
      return <Image source={{ uri: image }} style={styles.image} />
    }
    return null
  }

  renderCurationTags = (tags, status) => {
    if (tags.length && status === 'archived') {
      return tags.map(tag => {
        return (
          <Tag
            key={tag.id}
            tag={tag.name}
            style={styles.smallTag}
            tagStyle={styles.smallTagStyle}
            onPress={() => {}}
          />
        )
      })
    }
    return null
  }

  render() {
    const {
      title,
      url,
      comment,
      owner,
      date_added: date,
      link_id: id,
      curation_id: curation,
      shared_with: sharedWith,
      rating,
      tags,
      status,
    } = this.props.link

    const formattedComment = comment ? `"${comment}"` : ''
    const placeholder = <Image source={require('../../../assets/images/no_image_placeholder.png')} style={styles.placeholderImage} />
    const image = <Image source={{ uri: this.props.link.image }} style={styles.image} />
    const picture = this.props.link.image ? image : placeholder
    return (
      <CardSection style={{ flex: 1 }}>
        <TouchableOpacity key={id} onPress={() => this.openInWebBrowser(url)}>
          <Title title={title.trim()} size="small" />
          {picture}
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={this.showSharedWith}>
            <Text style={styles.owner}>{owner.name}</Text>
            <Icon name="people" size={14} color={primaryGreen} />
            <Text style={styles.count}> {sharedWith}</Text>
          </TouchableOpacity>
          <Text style={styles.date}>{this.formatDate(date)}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {this.renderCurationTags(tags, status)}
        </View>
        <View style={styles.subtitle}>
          <Text style={styles.comment}>{formattedComment}</Text>
          {this.renderMoreIcon(curation)}
        </View>
        {this.renderIcons(curation, owner, rating)}
      </CardSection>
    )
  }
}

const mapStateToProps = ({ conversation }) => {
  const { loading: conversationLoading } = conversation
  return { conversationLoading }
}

export default connect(mapStateToProps, {
  createConversation,
  getConversations,
})(Card)
