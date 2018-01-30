import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, BrowserRouter} from 'react-router-dom'
import {logout} from '../store'
import Search from './search/search'
import InterviewBoardContainer from './interview-container/interview-board-container'
import Questions from './questions/questions'
import SearchBar from './search-bar/search-bar'
import { startSoloPractice } from './interview-container/save-state-reducer'

const Main = (props) => {
  console.log("about to go to page", props.location)
  return (
    <BrowserRouter>
    <div id = "rootDiv">
      <SearchBar />
      <div>
      <button id='open' onClick={()=> openNewRoom()}>Open New Room</button>
      <button id='join' onClick={()=> joinOpenedRoom()}>Join existing room</button>
      <button id='solo' onClick={()=> props.soloRoom(props)}>Solo</button>
    </div>
      
        <Switch>
          <Route exact path="/questions" render={() => <Questions /> } />
          <Route exact path="/whiteboard" component= { InterviewBoardContainer } />
          <Route exact path="/search" render={() => <Search /> } />
          <Route path='/hitroot' />
        </Switch>
     
    </div>
    </BrowserRouter>
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
    },
    soloRoom (props) {
      console.log("solo room props", props)
      dispatch(startSoloPractice(props.history))
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
