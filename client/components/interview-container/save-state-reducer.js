import axios from 'axios'
import store from '../../store'
const SAVE_STATE = 'SAVE_STATE'


export const updateSaveState = (saved) => ({
    type: SAVE_STATE, saved
})

export const saveState = (text, board, panesep) => dispatch => {
    console.log("SAVE TRIGGERED")
    if (!text) text = store.getState().textarea;
    if (!board) board = store.getState().whiteboard;
    if (!panesep) panesep = store.getState().panesep
    axios.post('/api/state', {text, board, panesep})
    .then(res => res.data)
    .then(res => {
        console.log("data saved", res)
    })
}

export default function (state=true, action) {
    switch (action.type) {
        case SAVE_STATE: 
            return {...state, saved: action.saved}
        default: return state;
    }
}