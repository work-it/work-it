import axios from 'axios'

const SAVE_STATE = 'SAVE_STATE'

export const updateSaveState = (saved) => ({
    type: SAVE_STATE, saved
})

export const saveState = (text, board, panesep) => dispatch => {
    axios.post('/api/state', {text, board, panesep})
    .then(res => res.data)
    .then(res => {
        console.log("data saved", res)
    })
}

export default function (state=true, action) {
    switch (action.type) {
        case SAVE_STATE: 
            return action.saved
        default: return state;
    }
}