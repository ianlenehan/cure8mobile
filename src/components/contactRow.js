import React from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import { Icon } from 'react-native-elements'

const getRightTitle = (props) => {
  if (props.editMode) {
    return (
      <Icon
        name='delete'
        color='#ddd'
        onPress={props.onDeletePress}
      />
    )
  } else if (props.rightTitle) {
    return <Text style={styles.rightTitle}>{props.rightTitle}</Text>
  }
  return (
    <Icon
      name={props.chevronType || 'chevron-right'}
      type={props.iconType}
      color={props.iconColour || '#f3f3f3'}
    />
  )
}

const formatName = (props) => {
  if (props.title && props.isMember) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>{props.title || ''}</Text>
        <Icon
          name="check-circle"
          size={14}
          color={'#27ae60'}
          containerStyle={{ marginTop: 4 }}
        />
      </View>
    )
  }
  return <Text style={styles.title}>{props.title || ''}</Text>
}

const ContactRow = (props) => {
  const { contact, onPress, subtitle } = props
  return (
    <TouchableWithoutFeedback onPress={() => onPress(contact)}>
      <View style={styles.card}>
          <View style={styles.details}>
            {formatName(props)}
            <Text style={styles.subtitle}>{subtitle}</Text>
            {getRightTitle(props)}
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ContactRow

const styles = {
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    paddingTop: 3,
    paddingRight: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#ddd',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  rightTitle: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
    alignItems: 'flex-end'
  }
}
