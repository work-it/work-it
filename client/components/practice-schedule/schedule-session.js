import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import './schedule-session.css';

const ScheduleSession = (props) => {
  const { id, userOne, userTwo, start, testUser } = props;
  let type;
  let classFortype = 'schedule-session ';

  if (userOne === testUser.id && !userTwo) {
    type = 'waiting';
    classFortype += type;
  } else if (userOne === testUser.id && userTwo) {
    type = 'paired';
    classFortype += type;
  } else {
    type = 'available';
    classFortype += type;
  }

  return (
    <div className={classFortype}>
      {type === 'available' && <div>
        <h4>{userOne} is available</h4>
        <h4>{start}</h4>
      </div>}
      {type === 'waiting' && <div>
        <h4>I am available</h4>
        <h4>{start}</h4>
      </div>}
      {type === 'paired' && <div>
        <h4>Paired with {userTwo}</h4>
        <h4>{start}</h4>
      </div>}
    </div>
  )
}

const mapState = (state) => {
  return {
    testUser: {id: 99999}
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(ScheduleSession))


