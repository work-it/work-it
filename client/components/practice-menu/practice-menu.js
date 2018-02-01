import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startSolo, leaveRoom, joinPairPractice } from '../practice-pairs/practice-reducer'
import './practice-menu.css'

class PracticeMenu extends Component{
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    if (this.props.join) {
      const roomName = this.props.join;
      this.props.joinPair(roomName, this.props.history)
    }
  }
 

render (){
  const { changeView, available, changeAvailability } = this.props;
  return (
    <div className="practice-menu">
      <div className="col-sm-6 text-left">
        <ul className="list-inline">
          <li><a onClick={() => {
            if (this.props.room && this.props.room.name) this.props.exitRoom(this.props.room.name)
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
    joinPair ( roomName, history) {
      dispatch(joinPairPractice(roomName, history))
    },
    exitRoom (roomName) {
      dispatch(leaveRoom(roomName))
    }
  }
}
export default withRouter(connect(mapState, mapDispatch)(PracticeMenu))


