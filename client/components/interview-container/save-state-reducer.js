import axios from 'axios'

const SAVE_STATE = 'SAVE_STATE'
const START_SOLO = 'START_SOLO'
const START_PAIR = 'START_PAIR'
const JOIN_ROOM = 'JOIN_ROOM'

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

export const startPair = (roomName, authToken, id, err) => ({
    type: START_PAIR,
    roomName, authToken, id, err
})

export const joinRoom = (roomName, authToken, id, err) => ({
    type: JOIN_ROOM,
    roomName, authToken, id, err
})

export const startPairPractice = () => dispatch => {
    //1.  get authToken
    axios.get('/api/rooms/token?status=start')
            .then(res => res.data)
            .then ( token => {
                //2.  set status, room name and auth_token onto the status
                dispatch (startPair(token.roomName, token.token, token.identity, token.err))
                
                
            })
            .catch(console.log);
}

export const joinPairPractice= (roomName, history) => dispatch => {
    //1.  get authToken
    axios.get(`/api/rooms/token?status=join&room=${roomName}`)
            .then(res => res.data)
            .then ( token => {
                //2.  join room
                dispatch (joinRoom(token.roomName, token.token, token.identity, token.err))
                //history.push('/whiteboard')
            })
            .catch(console.log);
}
const defaultState = {
    saved: true,
    practiceStatus: 'none',
    roomName: '',
    id: '',
    authToken: '', 
    err: undefined,
}

export default function (state=defaultState, action) {
    switch (action.type) {
        case SAVE_STATE: 
            return {...state, saved: action.saved}
        case START_SOLO: 
            return {...state, practiceStatus: 'solo'}
        case START_PAIR:
            return {...state, practiceStatus: 'pair_started', roomName: action.roomName, id: action.id, authToken: action.authToken, err: action.err}
        case JOIN_ROOM:
            return {...state, practiceStatus: 'pair_in_room', roomName: action.roomName, id: action.id, authToken: action.authToken, err: action.err}
        default: return state;
    }
}