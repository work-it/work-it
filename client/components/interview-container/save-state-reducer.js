import axios from 'axios'

const SAVE_STATE = 'SAVE_STATE'
const START_SOLO = 'START_SOLO'
const START_PAIR = 'START_PAIR'

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

export const startPair = (roomName, authToken, id) => ({
    type: START_PAIR,
    roomName, authToken, id
})

export const startPairPractice = history => dispatch => {
    //1.  get authToken
    axios.get('/api/rooms/token?status=start')
            .then(res => res.data)
            .then ( token => {
                //2.  set status, room name and auth_token onto the status
                dispatch (startPair(token.roomName, token.token, token.identity))
            })
            .catch(console.log);
}
const defaultState = {
    saved: true,
    practiceStatus: 'none',
    roomName: '',
    id: '',
    authToken: ''
}

export default function (state=defaultState, action) {
    switch (action.type) {
        case SAVE_STATE: 
            return {...state, saved: action.saved}
        case START_SOLO: 
            return {...state, practiceStatus: 'solo'}
        case START_PAIR:
            return {...state, practiceStatus: 'pair_started', roomName: action.roomName, id: action.id, authToken: action.authToken}
        default: return state;
    }
}