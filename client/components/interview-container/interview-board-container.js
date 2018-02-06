import React, {Component} from 'react';
import InterviewBoard from '../interview-board/interview-board';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { saveState} from './save-state-reducer';
import {fetchPractice, endOpenedRoom, leaveRoom } from '../practice-pairs/practice-reducer'
import Questions from '../questions/questions-container';
import Video from '../video/video';
import {Button} from 'semantic-ui-react';


import './interview-container.css'

class InterviewBoardContainer extends Component {
    constructor (props) {
        super (props)
    }

    componentDidMount () {
        this.props.loadPracticeState()
    }

    render () {
        console.log("practice status: "+this.props.status)
    return (
        <div className = "interview-board-container">
            <div className = "interview ">
                <Button className="end-btn" size="large"  color="blue" onClick={() => this.props.status==='solo'?this.props.exitRoom(null):this.props.endRoom(this.props.room)}>End</Button>
                <InterviewBoard />
            </div>

            <div className = "sidebar ">
                <div className="video">
                    <Video />
                </div>
                <div className= "questions">
                    <Questions />
                </div>
            </div>
        </div>
    )
}
}

const mapState = state => ({
    text: state.textarea,
    board: state.whiteboard.history,
    panesep: state.panesep,
    status: state.practice.practiceStatus,
    room: state.practice.room
})

const mapDispatch = dispatch => ({
    save: (text, board, panesep) => dispatch(saveState(text, board, panesep)),
    loadPracticeState: () => dispatch (fetchPractice()),
    end: room => dispatch (endOpenedRoom(room?room.name:'', 'room')),
    exitPracticeRoom: () => dispatch (leaveRoom())
})

const mergeProps = (state, actions) => ({
    ...state,
    ...actions,
    endRoom: room => {
        actions.save(state.text, state.board, state.panesep);
        actions.end(room);
    },
    exitRoom: () => {
        actions.save(state.text, state.board, state.panesep);
        actions.exitPracticeRoom()
    }
})

export default withRouter(connect(mapState, mapDispatch, mergeProps)(InterviewBoardContainer))

