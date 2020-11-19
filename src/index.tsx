import React from 'react'
import _App from './App'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'

const App = hot(_App)

render(<App />, document.getElementById('root'))
