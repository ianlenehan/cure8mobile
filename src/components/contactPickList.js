import React, { Component } from 'react'
import { Text, SectionList } from 'react-native'
import ContactRow from './contactRow'

const styles = {
  sectionHeader: {
    backgroundColor: '#f3f3f3',
    padding: 5,
  },
  contactsHint: {
    padding: 20,
  },
}

class ContactPickList extends Component {
  constructor(...args) {
    super(...args);
    this.renderItem = this.renderItem.bind(this)
    this.renderSectionHeader = this.renderSectionHeader.bind(this)
  }
  getIconColour(contactId) {
    if (this.props.selectedContacts.includes(contactId)) {
      return '#27ae60'
    }
    return '#f3f3f3'
  }

  renderItem({ item }) {
    const iconColour = this.getIconColour(item.id)
    return (
      <ContactRow
        contact={item}
        title={item.name}
        isMember={item.member}
        chevronType="circle"
        iconType="font-awesome"
        iconColour={iconColour}
        onPress={() => this.props.onPress(item.id)}
      />
    )
  }

  renderSectionHeader = ({ section }) => {
    return <Text style={styles.sectionHeader}>{section.key}</Text>
  }

  render() {
    const { contacts, groups } = this.props
    if (contacts && contacts.length) {
      return (
        <SectionList
          sections={[{ data: groups, key: 'Groups' }, { data: contacts, key: 'Contacts' }]}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          editMode={this.props.editMode}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={false}
        />
      )
    }
    const text = 'No contacts here? Add contacts from your phone using the app\'s contacts' +
      ' section if you\'d like to share this link with anyone.'
    return (
      <Text style={styles.contactsHint}>
        {text}
      </Text>
    )
  }
}

export default ContactPickList
