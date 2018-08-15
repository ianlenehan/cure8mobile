import { StackNavigator } from 'react-navigation'
import { primaryGreen } from '../../variables'
import OldLinks from '../../screens/oldLinks'

export default StackNavigator({
  oldLinks: { screen: OldLinks },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  },
})
