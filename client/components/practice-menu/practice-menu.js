import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startSoloPractice, startPairPractice } from '../interview-container/save-state-reducer'
import './practice-menu.css'

const PracticeMenu = (props) => {
  const { changeView, available, changeAvailability } = props;
  return (
    <div className="practice-menu">
      <div className="col-sm-6 text-left">
        <ul className="list-inline">
          <li><a onClick={() => changeView('pair')}>Pair</a></li>
          <li><a onClick={() => changeView('schedule')}>Schedule</a></li>
          <li><a onClick={()=> props.soloRoom(props)}>Solo</a></li>
          <li><a onClick={() => changeView('history')}>History</a></li>
        </ul>
      </div>
      <div className="col-sm-6 text-right">
        <ul className="list-inline">
          <li><button onClick={() => changeAvailability()}>Change Availility</button></li>
          <li>Available: {available ? 'YES' : 'NO'}</li>
          <li><a onClick={() => changeView('settings')}>Settings</a></li>
        </ul>
      </div>
    </div>
  )
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
    soloRoom (props) {
      console.log("solo room props", props)
      dispatch(startSoloPractice(props.history))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticeMenu))


