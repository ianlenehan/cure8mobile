import React from 'react'
import { List, ListItem } from 'react-native-elements'

const getSubtitle = (contact, props) => {
  if (props.subtitle) {
    return `${contact.members.length} members`
  }
  return true
}

const onPressEvent = (contact, props) => {
  if (props.onPress) {
    return () => props.onPress(contact)
  }
  return true
}

const ContactList = (props) => {
  return (
    <List containerStyle={styles.container}>
      {
        props.contacts.map((contact, i) => (
          <ListItem
            key={i}
            title={contact.name}
            rightTitle={contact.phone}
            onPress={onPressEvent(contact, props)}
            rightTitleStyle={styles.subtitle}
            hideChevron={props.hideChevron}
            subtitle={getSubtitle(contact, props)}
          />
        ))
    }
    </List>
  )
}

export default ContactList

const styles = {
  container: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 12,
  },
}
