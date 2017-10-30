import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Linking,
  Clipboard,
  Platform,
  AsyncStorage,
  Alert
} from 'react-native'
import moment from 'moment'
import { Icon } from 'react-native-elements'
import SafariView from 'react-native-safari-view'
import { CustomTabs } from 'react-native-custom-tabs'
import Title from './title'
import MyIcon from './icon'
import CardSection from './cardSection'
import Spinner from './spinner'

class Card extends Component {
  state = { morePressed: null, alertMsgCurator: null }

  async componentDidMount() {
    const alertMsgCurator = await AsyncStorage.getItem('alertMsgCurator')
    this.setState({ alertMsgCurator })
  }

  getBillMurray() {
    const sizes = [150, 160, 170, 180, 190, 200]
    const min = Math.ceil(0);
    const max = Math.floor(5);
    const number = Math.floor(Math.random() * (max - min)) + min
    const size = sizes[number]
    return `http://fillmurray.com/300/${size}`
  }

  messageOwner = async (phone) => {
    const { title } = this.props.link
    Clipboard.setString(`Re: "${title}" from Cure8.`);
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
    this.setState({ morePressed: null })
    this.props.onArchivePress(null)
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

  formatDate(date) {
    const currentDate = moment()
    return moment(date).local().from(currentDate)
  }

  renderMainIcons(curation, owner, rating) {
    const { name, phone: ownerPhone } = owner
    const firstName = name.split(' ')[0]
    if (this.props.status === 'new' && this.state.morePressed === curation) {
      if (this.props.loading) {
        return <Spinner size="small" />
      }
      return (
        <View style={styles.icons}>
          <MyIcon
            size={24}
            name='delete'
            color="#27ae60"
            onPress={() => this.props.onArchivePress(curation, 'deleted')}
            text='Delete'
          />
          <MyIcon
            size={24}
            name='archive'
            color="#27ae60"
            onPress={() => this.props.onArchivePress(curation, 'archived')}
            text='Archive'
          />
          <MyIcon
            size={24}
            name='comment'
            type='font-awesome'
            color="#27ae60"
            onPress={() => this.messageOwner(ownerPhone)}
            text={`Msg ${firstName}`}
          />
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
    } else if (this.state.morePressed === curation) {
      if (this.props.loading) {
        return <Spinner size="small" />
      }
      return (
        <View style={styles.icons}>
          <MyIcon
            size={24}
            name='delete'
            color="#27ae60"
            onPress={() => this.props.delete(curation, rating)}
            text='Delete'
          />
          <MyIcon
            size={24}
            name='comment'
            type='font-awesome'
            color="#27ae60"
            onPress={() => this.messageOwner(ownerPhone)}
            text={`Msg ${firstName}`}
          />
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
    }
  }

  renderMoreIcon(curation) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (this.state.morePressed) {
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
          onPress={() => this.setState({ morePressed: curation })}
        />
      </View>
    )
  }

  renderIcons(curation, owner, rating) {
    const { archiveMode } = this.props
    if (archiveMode.curation === curation) {
      return (
        <View style={styles.icons}>
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name='thumb-up'
            color='#3498db'
            onPress={() => this.props.archiveLink(curation, 1)}
          />
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name='thumb-down'
            color='#e67e22'
            onPress={() => this.props.archiveLink(curation, 0)}
          />
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name='cancel'
            color='#ccc'
            onPress={() => this.props.onArchivePress(null)}
          />
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
      rating
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
  }
}

export default Card
