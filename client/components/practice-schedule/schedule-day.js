import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import ScheduleSession from './schedule-session'
import './schedule-day.css';

const ScheduleDay = (props) => {
  const { name, date, sessions } = props;

  return (
    <div className="schedule-day">
      <h4 className="text-center day-name">{name}</h4>
      <h5 className="text-center">{moment(date).format('MMM Do YYYY')}</h5>
      {
        !!sessions.length && sessions.map(session => {
          return <ScheduleSession key={Math.floor(Math.random()*1000000000000)} session={session} date={date} handleClick={props.handleClick} />
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
