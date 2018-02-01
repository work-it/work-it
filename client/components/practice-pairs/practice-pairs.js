import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startPairPractice,joinPairPractice, loadOpenRooms, endOpenedRoom } from './practice-reducer'
import InterviewBoardContainer from '../interview-container/interview-board-container';
import UserTile from '../tile-user/tile-user'



class PracticePairs extends Component{
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.loadRooms();
  }

  render () {
   console.log("-----------should interview container be displayed? does history exist ",this.props.history)
    return (
      this.props.userId?
        (this.props.status==='pair_in_room' || this.props.status ==='solo'?<InterviewBoardContainer/>:(
        <div className="practice-pairs">
            { 
              !this.props.myRoom.name?<button id='open' onClick={()=> this.props.openNewRoom()}>Open New Room</button>:null
            }
            {
              this.props.openRooms.map(room => 
                  <div key={room.name}>
                    <UserTile fixedView={true} initView={0}/>
                    {
                      this.props.userId === room.initiator? <button id='close' onClick={() => this.props.closeOpenedRoom(room.name)} >Close your room {room.name}</button>
                      :<button id='join' onClick={() => this.props.joinOpenedRoom(room.name, this.props.history)}>Join existing room {room.name}</button>
                    }
                  </div>
              )
            }    
        </div>))
        : <div></div>
      )
    
  }
}
const mapState = (state) => {
  return {
    status: state.practice.practiceStatus,
    openRooms: state.practice.rooms,
    myRoom: state.practice.room,
    userId: state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    openNewRoom () {
      dispatch(startPairPractice())
    },
    joinOpenedRoom (room, history) {
      //e.preventDefault();
     // console.log("events", e.target)
      dispatch(joinPairPractice(room, history))
    },
    closeOpenedRoom (room) {
      dispatch (endOpenedRoom(room, 'all'))
    },
    loadRooms () {
      dispatch(loadOpenRooms());
    }
  }
}

// const mergeDispatch = (state, actions, ownProps) => ({
//   ...state,
//   ...actions,
//   ...ownProps,
//   joinOpenedRoom( e ) {
//     e.preventDefault();
//     actions.joinOpenedRoom(e.target.roomName.value, ownProps.history)
//   }
// })

export default withRouter(connect(mapState, mapDispatch)(PracticePairs))

