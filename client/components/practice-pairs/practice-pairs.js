import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { startPairPractice,joinPairPractice, loadOpenRooms } from './practice-reducer'
import interviewBoardContainer from '../interview-container/interview-board-container';



class PracticePairs extends Component{
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.loadRooms();
  }

  render () {
 
    return (
      this.props.status==='pair_in_room'?<interviewBoardContainer/>:(
      <div className="practice-pairs">
          <button id='open' onClick={()=> this.props.openNewRoom()}>Open New Room</button>
          {
            this.props.openRooms.map(room => 
              <form key={room.name} onSubmit={this.props.joinOpenedRoom}>
                <input type="hidden" name="roomName" value={room.name}/>
                <button id='join' type="submit">Join existing room {room.name}</button>
              </form>
            )
          }    
      </div>
      )
    )
  }
}
const mapState = (state) => {
  return {
    status: state.practice.practiceStatus,
    openRooms: state.practice.rooms
  }
}

const mapDispatch = (dispatch) => {
  return {
    openNewRoom () {
      dispatch(startPairPractice())
    },
    joinOpenedRoom (e) {
      e.preventDefault();
      dispatch(joinPairPractice(e.target.roomName.value))
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

