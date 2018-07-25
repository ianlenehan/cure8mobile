import React from 'react'
import { StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { primaryGreen } from '../../variables'
import Contacts from '../../screens/contacts'
import ContactSearch from '../../screens/contactSearch'
import AddContact from '../../screens/addContact'
import Groups from '../../screens/groups'
import NewGroup from '../../screens/newGroup'

export default StackNavigator({
  myContacts: { screen: Contacts },
  contactSearch: { screen: ContactSearch },
  addContact: { screen: AddContact },
  myGroups: { screen: Groups },
  newGroup: { screen: NewGroup },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
    tabBarLabel: 'Contacts',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="address-book-o" type="font-awesome" size={24} color={tintColor} />
    },
  },
})
