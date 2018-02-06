import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import UserInProgress from '../user-in-progress/user-in-progress'
import UserFavorites from '../user-favorites/user-favorites'
import './user-container.css'

class UserMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'in-progress'
    }
  }

  render() {
    return (
      <div>
        <div className="user-menu row">
          <div className="col-sm-12 text-left">
            <ul className="list-inline">
              <li><Link to="/user/profile">Profile</Link></li>
              <li><Link to="/user/applications">In Progress</Link></li>
              <li><Link to="/user/saved">Saved</Link></li>
              <li><Link to="/user/archived">Archived</Link></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(UserMenu))
