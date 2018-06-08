import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import EmojiButton from './emoji-button'
import { ratings } from '../../../helpers/ratings'

class RatingIcons extends Component {
  constructor() {
    super()
    this.ratings = ratings
  }

  render() {
    const { curation, selectedTags } = this.props
    return (
      <View>
        <View style={styles.icons}>
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings['+1'], selectedTags)}
            name="+1"
            render
          />
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings.green_heart, selectedTags)}
            name="green_heart"
            render={this.props.renderAllIcons}
          />
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings.joy, selectedTags)}
            name="joy"
            render={this.props.renderAllIcons}
          />
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings.astonished, selectedTags)}
            name="astonished"
            render={this.props.renderAllIcons}
          />
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings.cry, selectedTags)}
            name="cry"
            render={this.props.renderAllIcons}
          />
          <EmojiButton
            onPress={() => this.props.archiveLink(curation, this.ratings.angry, selectedTags)}
            name="angry"
            render={this.props.renderAllIcons}
          />
          <Icon
            size={24}
            containerStyle={{ margin: 5 }}
            name="cancel"
            color="#ccc"
            onPress={() => this.props.onArchivePress(null)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            horizontal
          >
            {this.props.renderTags()}
          </ScrollView>
        </View>
        {this.props.addTagInput()}
      </View>
    )
  }
}

const styles = {
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
}

export default RatingIcons
