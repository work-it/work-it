import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startPairPractice,startSolo, leaveRoom, joinPairPractice, endOpenedRoom } from '../practice-pairs/practice-reducer'
import './practice-menu.css'

class PracticeMenu extends Component{
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    if (this.props.join) {
      const roomName = this.props.join;
      const token = this.props.token;
      this.props.joinPair(roomName, this.props.history, token)
    }
    console.log("practice status", this.props.status)
  }


render (){
  const { changeView, available, changeAvailability } = this.props;
  return (
    <div className="practice-menu">
      <div className="col-sm-6 text-left">
        <ul className="list-inline">
          <li><a onClick={() => {
            if (this.props.room && this.props.room.name && this.props.status==='pair_in_room') this.props.exitRoom(this.props.room.name)
            if (this.props.status === 'solo') this.props.exitRoom(null)
           changeView('pair')
        }}>Pair</a></li>
          <li><a onClick={() => changeView('schedule')}>Schedule</a></li>
          <li><a onClick={()=>  {
            this.props.soloRoom();
            changeView('solo')
          }}>Solo</a></li>
          <li><a onClick={() => changeView('history')}>History</a></li>
        </ul>
      </div>
    </div>
  )
}
}
const mapState = (state) => {
  return {
    room: state.practice.room,
    status: state.practice.practiceStatus
  }
}

const mapDispatch = (dispatch) => {
  return {
    soloRoom () {
      dispatch(startSolo())
    },
    openNewRoom () {
      dispatch(startPairPractice())
    },
    joinPair ( roomName, history, token) {
      dispatch(joinPairPractice(roomName, history, token))
    },
    exitRoom (roomName) {
      //dispatch(leaveRoom(roomName))
      dispatch(endOpenedRoom(roomName))
    }
  }
}
export default withRouter(connect(mapState, mapDispatch)(PracticeMenu))


