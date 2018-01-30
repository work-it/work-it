import axios from 'axios'

const SAVE_STATE = 'SAVE_STATE'
const START_SOLO = 'START_SOLO'

export const updateSaveState = (saved) => ({
    type: SAVE_STATE, saved
})

const startSolo = () => ({
    type: START_SOLO
})
export const saveState = (text, board, panesep) => dispatch => {
    axios.post('/api/state', {text, board, panesep})
    .then(res => res.data)
    .then(res => {
        console.log("data saved", res)
    })
}

export const startSoloPractice = history => dispatch => {
    dispatch(startSolo());
    history.push('/whiteboard');
}

const defaultState = {
    saved: true,
    practiceStatus: 'none',
    roomName: ''
}

export default function (state=defaultState, action) {
    switch (action.type) {
        case SAVE_STATE: 
            return {...state, saved: action.saved}
        case START_SOLO: 
            return {...state, practiceStatus: 'solo'}
        default: return state;
    }
}