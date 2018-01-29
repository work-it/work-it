import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, BrowserRouter} from 'react-router-dom'
import {logout} from '../store'
import Search from './search/search'
import InterviewBaord from './interview-board/interview-board'
import Questions from './questions/questions'


const Main = (props) => {
  return (
    <div id='rootDiv'>
      <BrowserRouter>
        <Switch>
          <Route exact path="/question" render={() => <Questions /> } />
          <Route exact path="/whiteboard" render={() => <InterviewBaord /> }/>
          <Route exact path="/search" render={() => <Search /> } />
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
