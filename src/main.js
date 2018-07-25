import React, { Component } from 'react'
import { AppState, AsyncStorage } from 'react-native'
import { Provider } from 'react-redux'
import { Root } from 'native-base'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './redux/reducers'
import Navigators from './components/navigators/main'

class App extends Component {
  state = {
    appState: AppState.currentState,
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const token = await AsyncStorage.getItem('token')
      console.log('App has come to the foreground!')
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return (
      <Root>
        <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <Navigators />
        </Provider>
      </Root>
    )
  }
}

export default App
