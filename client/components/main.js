import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, BrowserRouter} from 'react-router-dom'
import {logout} from '../store'
import Search from './search/search'
import InterviewBoardContainer from './interview-container/interview-board-container'
import Questions from './questions/questions'
import SearchBar from './search-bar/search-bar'
import UserTile from './tile-user/tile-user'

const Main = (props) => {
  return (
    <div id = "rootDiv">
      <SearchBar />
      <BrowserRouter>
        <Switch>
          <Route exact path="/questions" render={() => <Questions /> } />
          <Route exact path="/whiteboard" render={() => <InterviewBoardContainer /> } />
          <Route exact path="/search" render={() => <Search /> } />
          <Route exact path="/tile-user" render={() => <UserTile /> } />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
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
