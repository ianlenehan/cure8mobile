import React, { Component } from 'react'
import Slides from '../components/slides'

class Tour extends Component {
  onSlidesComplete = async () => {
    this.props.navigation.navigate('linksNavigator')
  }

  render() {
    return <Slides onComplete={this.onSlidesComplete} />
  }
}

export default Tour
