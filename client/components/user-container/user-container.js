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
              <li>
              {
                this.props.isEmployer?<Link to="/applications/employer">In Progress</Link>:<Link to="/applications/in-progress">In Progress</Link>
              }
              
              </li>
              <li><Link to="/applications/archived">Archived</Link></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    isEmployer: state.user.employer
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(UserMenu))
