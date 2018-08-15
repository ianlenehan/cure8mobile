import { StackNavigator } from 'react-navigation'
import { primaryGreen } from '../../variables'
import Activity from '../../screens/activity'

export default StackNavigator({
  activity: { screen: Activity },
}, {
  navigationOptions: {
    headerTintColor: 'white',
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: primaryGreen,
    },
  },
})
