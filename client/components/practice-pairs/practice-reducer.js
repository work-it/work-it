import axios from 'axios'

const START_SOLO = 'START_SOLO'
const START_PAIR = 'START_PAIR'
const JOIN_ROOM = 'JOIN_ROOM'
const UPDATE_ROOMS = 'UPDATE_ROOMS'

export const startSolo = () => ({
    type: START_SOLO
})

export const startPair = (roomName, authToken, id, err) => ({
    type: START_PAIR,
    roomName, authToken, id, err
})

export const joinRoom = (roomName, authToken, id, err) => ({
    type: JOIN_ROOM,
    roomName, authToken, id, err
})

const updatedRooms = (rooms) => ({
    type: UPDATE_ROOMS, rooms
})

export const startPairPractice = () => dispatch => {
    //1.  get authToken
    axios.get('/api/rooms/token?status=start')
            .then(res => res.data)
            .then ( token => {
                //2.  set status, room name and auth_token onto the status
                dispatch (startPair(token.roomName, token.token, token.identity, token.err))
                dispatch(loadOpenRooms());
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

export const loadOpenRooms = () => dispatch => {
    axios.get('/api/rooms')
    .then(res => res.data)
    .then( rooms => {
        dispatch (updatedRooms(rooms))
        //console.log("got open rooms", rooms)
    })
}

const defaultState = {
    practiceStatus: 'none',
    roomName: '',
    id: '',
    authToken: '', 
    err: undefined,
    rooms: []
}

export default function (state=defaultState, action) {
    switch (action.type) {
        case START_SOLO: 
            return {...state, practiceStatus: 'solo'}
        case START_PAIR:
            return {...state, practiceStatus: 'pair_started', roomName: action.roomName, id: action.id, authToken: action.authToken, err: action.err}
        case JOIN_ROOM:
            return {...state, practiceStatus: 'pair_in_room', roomName: action.roomName, id: action.id, authToken: action.authToken, err: action.err}
        case UPDATE_ROOMS:
            return {...state, rooms: action.rooms}
        default: return state;
    }
}