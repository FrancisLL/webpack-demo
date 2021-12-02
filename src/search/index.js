'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/logo.jpg'
import { common } from '../../common'

class Search extends React.Component {

  constructor() {
    super(...arguments)

    this.state = {
      Text: null
    }
  }

  loadComponent() {
    console.log('loadComponent')
    // 返回 promise
    import('./text.js').then(Text => {
      this.setState({
        Text:Text.default
      })
    })
  }

  render() {
    console.log(common())
    const { Text } = this.state;
    return <div className="search-text">
      {
        Text ? <Text /> : null
      }
      Search Text 12222 <img src={ logo } onClick={ this.loadComponent.bind(this) }/>
      
    </div>
    
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)