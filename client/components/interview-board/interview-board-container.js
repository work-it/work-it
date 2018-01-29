import React from 'react';
import InterviewBoard from './interview-board'
import { connect } from 'react-redux';
import { saveState } from './save-state-reducer'

import './interview-board.css'

function InterviewBoardContainer (props) {
    return (
        <div id='interview-board-container'>
            <button onClick={()=>props.save()}>Save</button>
            
            <InterviewBoard />
        </div>
    )
}

const mapState = state => ({
    text: state.textarea,
    board: state.whiteboard.history,
    panesep: state.panesep
})

const mapDispatch = dispatch => ({
    save: (text, board, panesep) =>dispatch (saveState(text, board, panesep))
})

const mergeProps = (state, actions) => ({
    ...state,
    ...actions,
    save: () => actions.save(state.text, state.board, state.panesep)
})

export default connect (mapState, mapDispatch, mergeProps)(InterviewBoardContainer)

