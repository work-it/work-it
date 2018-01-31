import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startSoloPractice, startPairPractice,joinPairPractice } from '../interview-container/save-state-reducer'
import interviewBoardContainer from '../interview-container/interview-board-container';

const PracticePairs = (props) => {
  return (
    props.status==='pair_in_room'?<interviewBoardContainer/>:(
    <div className="practice-pairs">
        <button id='open' onClick={()=> props.openNewRoom()}>Open New Room</button>
        <form onSubmit={props.joinOpenedRoom}>
          <input type="text" name="roomName"/>
        <button id='join' type="submit">Join existing room</button></form>
    </div>
    )
  )
}

const mapState = (state) => {
  return {
    status: state.saved.practiceStatus
  }
}

const mapDispatch = (dispatch) => {
  return {
    openNewRoom () {
      console.log("starting new room")
      dispatch(startPairPractice())
    },
    joinOpenedRoom (roomName, history) {
      dispatch(joinPairPractice(roomName, history))
    }
  }
}

const mergeDispatch = (state, actions, ownProps) => ({
  ...state,
  ...actions,
  ...ownProps,
  joinOpenedRoom( e ) {
    e.preventDefault();
    actions.joinOpenedRoom(e.target.roomName.value, ownProps.history)
  }
})

export default withRouter(connect(mapState, mapDispatch)(PracticePairs))

