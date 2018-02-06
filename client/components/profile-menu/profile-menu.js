import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import UserInProgress from '../user-in-progress/user-in-progress'
import UserFavorites from '../user-favorites/user-favorites'
import '../user-container/user-container.css'

class ProfileMenu extends Component {
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
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/profile/edit">Edit</Link></li>
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

export default withRouter(connect(mapState, mapDispatch)(ProfileMenu))
