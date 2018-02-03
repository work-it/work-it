import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import './schedule-session.css';
import {times} from './times';

const renderDetails = (type, start, userOne, userTwo, testUser) => {
  const startLocal = moment.utc(start, 'HH:mm').local().format('HH:mm');
  const startLocalTwelveHour = times.filter(time => time.value === startLocal)[0].text

  console.log(startLocalTwelveHour)

  switch (type) {
    case 'available':
      return (
        <div>
          <h4>{userOne} is available</h4>
          <h4>{startLocalTwelveHour}</h4>
        </div>
      )
    case 'waiting':
      return (
        <div>
          <h4>I am available</h4>
          <h4>{startLocalTwelveHour}</h4>
        </div>
      )
    case 'paired':
      return (
        <div>
          <h4>Paired with {userOne === testUser.id ? userTwo : userOne}</h4>
          <h4>{startLocalTwelveHour}</h4>
        </div>
      )
    default:
      break;
  }
}

const ScheduleSession = (props) => {
  console.log('props', props)
  const { id, userOne, start, date, userTwo } = props.session;
  let type;
  let classFortype = 'schedule-session ';
  const myUserId = props.myUserId;
  /*
waiting: YOU have set those times as available and you are waiting for a partner.
available: ANOTHER USER has set those times as available and you can choose to pair with them.
paired: YOU and ANOTHER USER have been paired together for that time. It doesn’t show paired partners if you aren’t one of the pairs.
  */
  if (userOne===myUserId && !userTwo) {
    type = 'waiting';
    classFortype += type;
  } else if (userOne===myUserId || userTwo===myUserId) {
    type = 'paired';
    classFortype += type;
  } else {
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
    myUserId: state.user?state.user.id:null
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(ScheduleSession))


