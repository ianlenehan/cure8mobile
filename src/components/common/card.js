import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Clipboard,
  Platform,
  AsyncStorage,
  Alert
} from 'react-native'
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

class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alertMsgCurator: null,
      phone: null,
      tags: [],
      selectedTags: [],
      tagSearchQuery: ''
    }
  }

  async componentDidMount() {
    const alertMsgCurator = await AsyncStorage.getItem('alertMsgCurator')
    const phone = await AsyncStorage.getItem('currentUserPhone')
    this.setState({
      alertMsgCurator,
      phone
    })

    if (this.props.link.status === 'archived') {
      const tags = this.props.link.tags.map(tag => tag.name)
      this.setState({ selectedTags: [...tags, ...this.state.selectedTags] })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags && nextProps.tags.length) {
      tags = nextProps.tags.sort()
      this.setState({ tags })
    }
  }

  getBillMurray() {
    const sizes = [150, 160, 170, 180, 190, 200]
    const min = Math.ceil(0)
    const max = Math.floor(5)
    const number = Math.floor(Math.random() * (max - min)) + min
    const size = sizes[number]
    return `http://fillmurray.com/300/${size}`
  }

  messageOwner = async (phone) => {
    const { title } = this.props.link
    Clipboard.setString(`Re: "${title}" from Cure8.`)
    if (!this.state.alertMsgCurator) {
      Alert.alert(
        'Did you know?',
        'From here, pressing paste into your message app will add the curated link title to your message.',
        [
          { text: 'Cool!', onPress: () => Linking.openURL(`sms:${phone}`) }
        ]
      )
      await AsyncStorage.setItem('alertMsgCurator', 'yes')
    } else {
      Linking.openURL(`sms:${phone}`)
    }
  }

  expandLess = () => {
    this.props.onDrawerPress(null)
    this.props.onArchivePress(null)
  }

  expandMore = (curation) => {
    this.props.onDrawerPress(curation)
  }

  renderMsgOwner(ownerPhone, firstName) {
    if (ownerPhone !== this.state.phone) {
      return (
        <MyIcon
          size={24}
          name='comment'
          type='font-awesome'
          color="#27ae60"
          onPress={() => this.messageOwner(ownerPhone)}
          text={`Msg ${firstName}`}
        />
      )
    }
  }

  openInWebBrowser = (url) => {
    const readerMode = this.props.readerMode === 'on' ? true : false
    if (Platform.OS === 'ios') {
      SafariView.show({
        url,
        readerMode,
        tintColor: '#27ae60',
        barColor: '#27ae60'
      })
    } else if (Platform.OS === 'android') {
      CustomTabs.openURL(url)
    }
  }

  onArchivePress(owner, curation, action) {
    const { selectedTags } = this.state
    if (owner.phone === this.state.phone && action === 'deleted') {
      this.props.justArchive(curation, 1, action)
    } else {
      this.props.onArchivePress(curation, action)
    }
  }

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  renderMainIcons(curation, owner, rating) {
    const { name, phone: ownerPhone } = owner
    const firstName = name.split(' ')[0]
    if (this.props.status === 'new' && this.props.morePressed === curation) {
      if (this.props.loading) {
        return <Spinner size="small" />
      }
      return (
        <View style={styles.icons}>
          <MyIcon
            size={24}
            name='delete'
            color="#27ae60"
            onPress={() => this.onArchivePress(owner, curation, 'deleted')}
            text='Delete'
          />
          <MyIcon
            size={24}
            name='archive'
            color="#27ae60"
            onPress={() => this.onArchivePress(owner, curation, 'archived')}
            text='Archive'
          />
          {this.renderMsgOwner(ownerPhone, firstName)}
          <MyIcon
            size={24}
            type='font-awesome'
            name='share'
            color="#27ae60"
            onPress={() => this.props.onSharePress(this.props.link)}
            text='Share'
          />
        </View>
      )
    } else if (this.props.morePressed === curation) {
      if (this.props.loading) {
        return <Spinner size="small" />
      }
      return (
        <View>
          <View style={styles.icons}>
            <MyIcon
              size={24}
              name='delete'
              color="#27ae60"
              onPress={() => this.props.justArchive(curation, rating, 'deleted')}
              text='Delete'
              />
            {this.renderMsgOwner(ownerPhone, firstName)}
            <MyIcon
              size={24}
              type='font-awesome'
              name='share'
              color="#27ae60"
              onPress={() => this.props.onSharePress(this.props.link)}
              text='Share'
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
  }

  renderMoreIcon(curation) {
    if (this.props.morePressed === curation) {
      return (
        <View style={styles.icon}>
          <Icon
            size={32}
            name='expand-less'
            color='#27ae60'
            onPress={this.expandLess}
          />
        </View>
      )
    }
    return (
      <View style={styles.icon}>
        <Icon
          size={32}
          name='expand-more'
          color='#27ae60'
          onPress={() => this.expandMore(curation)}
        />
      </View>
    )
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

  renderTags() {
    const { tags, selectedTags } = this.state
    const { archiveMode, status } = this.props
    if (tags && (archiveMode.action === 'archived' || status === 'archived')) {
      return tags.map(tag => {
        const tagColour = selectedTags.includes(tag) ? '#27ae60' : '#ccc'
        return (
          <Tag
            style={{ backgroundColor: tagColour }}
            onPress={this.toggleTag.bind(this)}
            tag={tag}
            key={tag}
          />
        )
      })
    }
  }

  renderUpdateButton(status) {
    const { curation_id } = this.props.link
    const { selectedTags } = this.state
    if (status === 'archived') {
      return (
        <Button
          title='Update tags'
          backgroundColor='#27ae60'
          buttonStyle={{ marginBottom: 10, width: 150, padding: 8 }}
          fontSize={12}
          onPress={() => this.props.addTags(curation_id, selectedTags)}
        />
      )
    }
  }

  addTagInput() {
    const { archiveMode, status } = this.props
    if (archiveMode.action === 'archived' || status === 'archived') {
      return (
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <Input
              placeholder='type to add new tag'
              style={{ flex: 1, fontSize: 12, height: 30 }}
              onChangeText={this.tagSearch}
              value={this.state.tagSearchQuery}
              autoCapitalize={'none'}
            />
            <Icon
              color='#27ae60'
              reverse
              name='plus'
              type='font-awesome'
              onPress={this.addNewTag}
              size={12}
            />
          </View>
          {this.renderUpdateButton(status)}
        </View>
      )
    }
  }

  tagSearch = (query) => {
    this.setState({ tagSearchQuery: query })
  }

  addNewTag = () => {
    const { tags, selectedTags, tagSearchQuery } = this.state
    const cleanTag = tagSearchQuery.toLowerCase().trim()
    if (swearjar.profane(cleanTag)) {
      Alert.alert(
        'Oops',
        "Let's keep this clean, we might use tags publicy in a later release.",
        [{ text: 'Sorry' }]
      )
    } else {
      if (tags.includes(cleanTag)) {
        this.setState({ selectedTags: [...selectedTags, cleanTag] })
      } else {
        this.setState({
          selectedTags: [...selectedTags, cleanTag],
          tags: [cleanTag, ...tags]
        })
      }
    }
    this.tagSearch('')
  }

  renderThumbsDownIcon(owner, curation) {
    if (owner.phone !== this.state.phone) {
      return(
        <Icon
          size={24}
          containerStyle={{ margin: 5 }}
          name='thumb-down'
          color='#e67e22'
          onPress={() => this.props.archiveLink(curation, 0)}
        />
      )
    }
  }

  renderIcons(curation, owner, rating) {
    const { archiveMode } = this.props
    const { tags, selectedTags } = this.state
    if (archiveMode.curation === curation) {
      return (
        <View>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              horizontal
              >
              {this.renderTags()}
            </ScrollView>
          </View>
          {this.addTagInput()}
          <View style={styles.icons}>
            <Icon
              size={24}
              containerStyle={{ margin: 5 }}
              name='thumb-up'
              color='#3498db'
              onPress={() => this.props.archiveLink(curation, 1, selectedTags)}
            />
          {this.renderThumbsDownIcon(owner, curation)}
            <Icon
              size={24}
              containerStyle={{ margin: 5 }}
              name='cancel'
              color='#ccc'
              onPress={() => this.props.onArchivePress(null)}
            />
          </View>
        </View>
      )
    }
    return this.renderMainIcons(curation, owner, rating)
  }

  renderImage(image) {
    if (image) {
      return <Image source={{ uri: image }} style={styles.image} />
    }
  }

  renderCurationTags = (tags, status) => {
    if (tags.length && status === 'archived') {
      return tags.map(tag => {
        return (
          <Tag key={tag.id} tag={tag.name} tagStyle={{ fontSize: 10 }} />
        )
      })
    }
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
      status
    } = this.props.link

    const formattedComment = comment ? `"${comment}"` : ''
    const placeholder = this.getBillMurray()
    const image = this.props.link.image || placeholder
    return (
      <CardSection style={{ flex: 1 }}>
        <TouchableOpacity key={id} onPress={() => this.openInWebBrowser(url)}>
          <Title title={title.trim()} size='small' />
          <Image source={{ uri: image }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={styles.owner}>{owner.name}</Text>
            <Icon name='people' size={14} color="grey" />
            <Text style={styles.count}> {sharedWith}</Text>
          </View>
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

const styles = {
  title: {
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  image: {
    height: 200,
    paddingBottom: 5
  },
  subtitle: {
    flexDirection: 'row',
    margin: 5,
  },
  date: {
    fontSize: 8,
    color: 'grey',
    flex: 1,
    textAlign: 'right'
  },
  owner: {
    fontSize: 10,
    color: 'black',
    textAlign: 'left',
    paddingRight: 10
  },
  count: {
    fontSize: 10,
    color: 'grey'
  },
  comment: {
    fontSize: 12,
    color: 'grey',
    margin: 5,
    flex: 4
  },
  note: {
    fontSize: 12,
    color: 'grey',
    margin: 5,
  },
  noteView: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row'
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    padding: 5
  },
  icon: {
    flexDirection: 'row',
    flex: 0.5,
    paddingRight: 10,
    justifyContent: 'flex-end'
  },
  ratings: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tagContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 5,
    paddingTop: 5
  }
}

export default Card
