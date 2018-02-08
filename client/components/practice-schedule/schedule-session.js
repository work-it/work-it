import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import './schedule-session.css';
import {times} from './times';

const renderDetails = (type, start, userOne, userTwo, testUser) => {
  const startLocal = moment.utc(start, 'HH:mm').local().format('HH:mm');
  const startLocalTwelveHour = times.filter(time => time.value === startLocal)[0].text

  //console.log(startLocalTwelveHour)

  switch (type) {
    case 'available':
      return (
        <div>
          <h4>{startLocalTwelveHour}</h4>
          <h4>available</h4>
        </div>
      )
    case 'waiting':
      return (
        <div>
          <h4>{startLocalTwelveHour}</h4>
          <h4>I am available</h4>
          
        </div>
      )
    case 'paired':
      return (
        <div>
          <h4>{startLocalTwelveHour}</h4>
          <h4>Paired</h4>
          
        </div>
      )
    case 'interviewProposed':
    return (
      <div>
        <h4>{startLocalTwelveHour}</h4>
        <h4>Invited</h4>
        
      </div>
    )
    case 'interviewPaired':
    return (
      <div>
        <h4>{startLocalTwelveHour}</h4>
        <h4>Interview</h4>
        
      </div>
    )
    default:
      break;
  }
}

const ScheduleSession = (props) => {
  //console.log('props', props)
  const { id, userOne, start, date, userTwo, intervieweeId } = props.session;
  let type;
  let classFortype = 'schedule-session ';
  const myUserId = props.myUserId;
  /*
waiting: YOU have set those times as available and you are waiting for a partner.
available: ANOTHER USER has set those times as available and you can choose to pair with them.
paired: YOU and ANOTHER USER have been paired together for that time. It doesn’t show paired partners if you aren’t one of the pairs.
  */
  console.log("props.session", props.session)
  if (userOne===myUserId && !userTwo && !intervieweeId) {
    type = 'waiting';
    classFortype += type;
  } else if ( !intervieweeId && (userOne===myUserId || userTwo===myUserId) && userOne && userTwo) {
    console.log("userOne", userOne, "userTwo", userTwo, "interviewee", intervieweeId)
    type = 'paired';
    classFortype += type;
  } else if ( (intervieweeId===myUserId && !userTwo) || (userOne===myUserId && !userTwo && intervieweeId)) {
    type = 'interviewProposed';
    classFortype += type
  } else if (intervieweeId===myUserId && userOne && userTwo) {
    type = 'interviewPaired';
    classFortype += type
  }
  else {
    type = 'available';
    classFortype += type;
  }

  return (
    <div className={classFortype} onClick={() => props.handleClick(type, props.session)}>
      {renderDetails(type, start, userOne, userTwo, myUserId)}
    </div>
  )
}

const mapState = (state) => {
  return {
    myUserId: state.user?state.user.id:null,
    sched: state.schedule
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(ScheduleSession))


