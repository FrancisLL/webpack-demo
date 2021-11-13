'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/logo.jpg'

class Search extends React.Component {

  render() {
    console.log(1111)
    return <div className="search-text">
      Search Text 12222 <img src={ logo } />
      
    </div>
    
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)