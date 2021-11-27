'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/logo.jpg'
import '../../common'

class Search extends React.Component {

  render() {
    console.log(common())
    return <div className="search-text">
      Search Text 12222 <img src={ logo } />
      
    </div>
    
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)