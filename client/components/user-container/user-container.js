import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import UserInProgress from '../user-in-progress/user-in-progress'
import UserFavorites from '../user-favorites/user-favorites'

class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'in-progress'
    }
  }

  render() {
    return (
      <div>
        <div className="user-menu">
          <div className="col-sm-6 text-left">
            <ul className="list-inline">
              <li><a onClick={() => this.changeView('profile')}>Profile</a></li>
              <li><a onClick={() => this.changeView('in-progress')}>In Progress</a></li>
              <li><a onClick={()=> this.changeView('favorites')}>Saved</a></li>
              <li><a onClick={() => this.changeView('archived')}>Archived</a></li>
            </ul>
          </div>
          <div className="col-sm-6 text-right">
            <ul className="list-inline">
              <li><a onClick={() => this.changeView('settings')}>Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="user-view">
          {this.renderSubView()}
        </div>
      </div>
    )
  }

  changeView(view) {
    this.setState({view})
  }

  renderSubView() {
    const { view } = this.state;
    switch (view) {
      case 'profile':
        return <div>Profile</div>;
      case 'in-progress':
        return <UserInProgress type="in-progress" />
      case 'favorites':
        return <UserFavorites />;
      case 'archived':
        return <UserInProgress type="archived" />
      case 'settings':
        return <div>settings</div>;
      default:
        return <UserInProgress type="in-progress" />;
    }
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

export default withRouter(connect(mapState, mapDispatch)(UserContainer))
