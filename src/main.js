import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Root } from 'native-base'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './redux/reducers'
import Navigators from './components/navigators/main'

class App extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps
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
