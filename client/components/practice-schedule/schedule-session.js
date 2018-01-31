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
  const { id, userOne, userTwo, start, testUser, date } = props;
  let type;
  let classFortype = 'schedule-session ';

  if (userOne === testUser.id && !userTwo) {
    type = 'waiting';
    classFortype += type;
  } else if (userOne === testUser.id || userTwo === testUser.id) {
    type = 'paired';
    classFortype += type;
  } else {
    type = 'available';
    classFortype += type;
  }

  return (
    <div className={classFortype} onClick={() => props.handleClick(type, date, id )}>
      {renderDetails(type, start, userOne, userTwo, testUser)}
    </div>
  )
}

const mapState = (state) => {
  return {
    testUser: {id: 55555}
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(ScheduleSession))


