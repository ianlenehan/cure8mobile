import React from 'react'
import { TouchableWithoutFeedback, Image } from 'react-native'

const styles = {
  text: {
    fontSize: 8,
    color: 'grey',
  },
  header: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
  },
}

const Cure8Icon = () => {
  return (
    <TouchableWithoutFeedback style={styles.header}>
      <Image
        style={{ width: 100, height: 30 }}
        resizeMode="contain"
        source={require('../../../assets/icons/loading.png')}
      />
    </TouchableWithoutFeedback>
  )
}

export default Cure8Icon
