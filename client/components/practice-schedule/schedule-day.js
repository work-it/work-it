import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import ScheduleSession from './schedule-session'
import './schedule-day.css';

const ScheduleDay = (props) => {
  const { name, date } = props;
  const sessions = props.sessions[date];
  return (
    <div className="schedule-day">
      <h2>{name}</h2>
      {
        sessions && sessions.map(session => {
          return <ScheduleSession {...session} />
        })
      }
    </div>
  )
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(ScheduleDay))


