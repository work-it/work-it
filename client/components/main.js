import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {logout} from '../store'
import Search from './search/search'
import InterviewBoardContainer from './interview-container/interview-board-container'
import Questions from './questions/questions'
import PracticeContainer from './practice-container/practice-container'
import SearchBar from './search-bar/search-bar'
import UserTile from './tile-user/tile-user'
import UserProfileForm from './user-profile-form/user-profile-form'
import UserProfileContainer from './user-profile-form/user-profile-container'
import UserInProgres from './user-in-progress/user-in-progress'
import UserContainer from './user-container/user-container'
import UserChat from './user-chat/user-chat'
import JobView from './job-view/jobview'
import UserProfile from './user-profile-form/user-profile'
import { Login, Signup } from './auth/auth'
import {me} from '../store/user'
import history from './'
import UserFavorites from './user-favorites/user-favorites';
import Apply from './apply/apply'
import UserInProgress from './user-in-progress/user-in-progress';


class Main extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.props.loadInitialData()
  }

  render () {
    const {showAuth, authView, isLoggedIn, handleLogout} = this.props;
    return (
      <div id = "rootDiv">
        <SearchBar history={history} />
        {!isLoggedIn && showAuth && authView === 'signup' && <Signup />}
        {!isLoggedIn && showAuth && authView === 'login' && <Login />}
        {isLoggedIn && <a onClick={() => handleLogout()}>Logout</a>}
        <Switch>
          <Route exact path="/user/applications" render={() => <UserInProgress type="in-progress" />} />
          <Route exact path="/messages" render={() => <UserChat /> } />
          <Route path="/job/:id" render={()=><JobView />} />
          <Route path="/apply/:id" render={()=><Apply history={history} />} />
          <Route path="/user/:id" render={()=><UserProfile />} />
          <Route exact path="/user" render={() => <UserContainer /> } />
          <Route exact path="/inprogress" render={() => <UserInProgres /> } />
          <Route exact path="/practice" render={() => <PracticeContainer /> } />
          <Route path="/practice/:roomName" render={() => <PracticeContainer />} />
          <Route exact path="/questions" render={() => <Questions /> } />
          <Route exact path="/whiteboard" component= { InterviewBoardContainer } />
          <Route exact path="/search" render={() => <Search /> } />
          <Route exact path="/usertile" render={() => <UserTile /> } />
          <Route exact path="/userprofilecontainer" render={() => <UserProfileContainer /> } />
          <Route exact path="/user/saved" render={() => <UserFavorites /> } />
        </Switch>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    showAuth: state.auth.show,
    authView: state.auth.view
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
      dispatch(logout())
    },
    loadInitialData() {
      dispatch(me())
    },
    handleLogout() {
      dispatch(logout())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
