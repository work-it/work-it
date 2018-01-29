import React from 'react';
import InterviewBoard from '../interview-board/interview-board';
import { connect } from 'react-redux';
import { saveState } from './save-state-reducer';
import Questions from '../questions/questions';



import './interview-container.css'

function InterviewBoardContainer (props) {
    return (
        <div className = "interview-board-container">
            <div className = "interview ">
                <button onClick={() => props.save()}>Save</button>
                <InterviewBoard />
            </div>

            <div className = "sidebar ">
                <div className="video">
                    <p>'hiasdkjfhaskdfhalksdhfklasjdhfklj'</p>
                </div>
                <div className= "questions">
                    <Questions />
                </div>
            </div>
        </div>
    )
}

const mapState = state => ({
    text: state.textarea,
    board: state.whiteboard.history,
    panesep: state.panesep
})

const mapDispatch = dispatch => ({
    save: (text, board, panesep) => dispatch(saveState(text, board, panesep))
})

const mergeProps = (state, actions) => ({
    ...state,
    ...actions,
    save: () => actions.save(state.text, state.board, state.panesep)
})

export default connect(mapState, mapDispatch, mergeProps)(InterviewBoardContainer)

