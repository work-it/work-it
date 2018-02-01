import React, {Component} from 'react';
import InterviewBoard from '../interview-board/interview-board';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { saveState} from './save-state-reducer';
import {fetchPractice, endOpenedRoom } from '../practice-pairs/practice-reducer'
import Questions from '../questions/questions';
import Video from '../video/video';


import './interview-container.css'

class InterviewBoardContainer extends Component {
    constructor (props) {
        super (props)
    }

    componentDidMount () {
        this.props.loadPracticeState()
    }

    render () {
    return (
        <div className = "interview-board-container">
            <div className = "interview ">
                <button onClick={() => this.props.save()}>Save</button>
                <button onClick={() => this.props.end(this.props.room)}>End</button>
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
    end: room => dispatch (endOpenedRoom(room?room.name:'', 'room'))
})

const mergeProps = (state, actions) => ({
    ...state,
    ...actions,
    save: () => actions.save(state.text, state.board, state.panesep)
})

export default withRouter(connect(mapState, mapDispatch, mergeProps)(InterviewBoardContainer))

