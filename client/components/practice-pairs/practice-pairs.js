import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { joinPairPractice, loadOpenRooms, endOpenedRoom } from './practice-reducer'
import { loadAllUsers } from '../../store'
import InterviewBoardContainer from '../interview-container/interview-board-container';
import UserTile from '../tile-user/tile-user'



class PracticePairs extends Component{
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.loadRooms();
    this.props.loadUsers();
  }

  render () {
   //console.log("-----------should interview container be displayed? does history exist ",this.props.history)
    console.log('allProfiles', this.props.allProfiles)
    return (
      this.props.userId && this.props.allProfiles?
        (this.props.status==='pair_in_room' || this.props.status ==='solo'?<InterviewBoardContainer/>:(
        <div className="practice-pairs">

            {
              this.props.openRooms.map(room => {
                const user = this.props.allProfiles[room.initiator];
                console.log("room.initiator", room.initiator)
                  return <div key={room.name}>
                    
                  <a href={`/practice/${room.name}`}><UserTile fixedView={true} initView={0} footerText={this.getFooterText(room)} footer={this.getFooterFunction(room)} userId={room.initiator} {...user} /></a>
                    {
                 // this.props.userId === room.initiator? <button id='close' onClick={() => this.props.closeOpenedRoom(room.name)} >Close your room {room.name}</button>
           //       :<button id='join' onClick={() => this.props.joinOpenedRoom(room.name, this.props.history)}>Join existing room {room.name}</button>
                    }
                  </div>
                  }
              )
            }    
        </div>))
        : <div></div>
      )
    
  }

  getFooterFunction(room) {
    return this.props.userId===room.initiator
          ?()=>this.props.closeOpenedRoom(this.props.myRoom.name)
          :()=>this.props.history.push(`/practice/${room.name}`)
  }

  getFooterText (room) {
    return this.props.userId===room.initiator?'Close my room':'Join for Practice'
  }
}
const mapState = (state) => {
  return {
    status: state.practice.practiceStatus,
    openRooms: state.practice.rooms,
    myRoom: state.practice.room,
    userId: state.user.id,
    allProfiles: state.profile.allProfiles
  }
}

const mapDispatch = (dispatch) => {
  return {

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
    },
    loadUsers() {
      dispatch(loadAllUsers())
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

