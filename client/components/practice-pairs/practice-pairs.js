import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startSoloPractice, startPairPractice } from '../interview-container/save-state-reducer'

const PracticePairs = (props) => {
  return (
    <div className="practice-pairs">
        <button id='open' onClick={()=> props.openNewRoom()}>Open New Room</button>
        <button id='join' onClick={()=> joinOpenedRoom()}>Join existing room</button>
    </div>
  )
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
    openNewRoom (props) {
      console.log("starting new room")
      dispatch(startPairPractice())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticePairs))

