import React from 'react'
import { Input, Icon, Button } from 'semantic-ui-react'
import './search-bar.css'

const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <div className="row">
        <div className="col-sm-3">
          <h1 className="logo">WorkIt</h1>
        </div>
        <div className="col-sm-6">
          <Input className="search-input" action="Search" placeholder="Search our jobs..." /><Button basic className="advanced-btn">Advanced</Button>
        </div>
        <div className="col-sm-3">
          <ul className="list-inline menu-icons text-right">
            <li><Icon name='mail outline' size='big' /></li>
            <li><Icon name='user outline' size='big' /></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
