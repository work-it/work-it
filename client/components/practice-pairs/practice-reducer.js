import axios from 'axios'
import store from '../../store'

export const START_SOLO = 'START_SOLO'
export const START_PAIR = 'START_PAIR'
export const JOIN_ROOM = 'JOIN_ROOM'
export const UPDATE_ROOMS = 'UPDATE_ROOMS'
export const CLOSE_ROOM = 'CLOSE_ROOM'
export const ROOM_CLOSED = 'ROOM_CLOSED'
export const CONTINUE_SOLO = 'CONTINUE_SOLO'
export const ROOM_WAITING = 'ROOM_WAITING'
export const LOAD_PRACTICE = 'LOAD_PRACTICE'
export const LEAVE_ROOM = 'LEAVE ROOM'
const LOAD_HISTORY = 'LOAD_HISTORY'

const loadHistory = history => ({type: LOAD_HISTORY, history})
export const startSolo = () => ({
    type: START_SOLO
})

export const loadPractice = practice => ({
    type: LOAD_PRACTICE, practice
})

export const leaveRoom = room => ({
    type: LEAVE_ROOM
})

//trigered when close notice received from socket

export const roomClosed = room => ({
    type: ROOM_CLOSED
})

export const continueSolo = () => ({
    type: CONTINUE_SOLO
})

export const startPair = (room, authToken, id, err) => ({
    type: START_PAIR,
    room, authToken, id, err
})

export const joinRoom = (room, authToken, id, err) => {
    return ({type: JOIN_ROOM,
    room, authToken, id, err})
}

export const roomWaiting = () => {
    return ({type: ROOM_WAITING})
}
//triggered when sending close notice to socket
export const closeRoom = (room, target) => ({
    type: CLOSE_ROOM,
    room, target
})

const updatedRooms = (rooms) => ({
    type: UPDATE_ROOMS, rooms
})

export const fetchHistory = () => (dispatch, getState) => {
    axios.get(`/api/history`)
    .then(res => res.data)
    .then(res => {
        console.log('got history', res)
        dispatch (loadHistory(res))
    })
    .catch (console.log)
  }

export const fetchPractice = () => dispatch => {
    axios.get(`/api/rooms/token?status=fetch`)
    .then (res => res.data)
    .then (token => {
        if (token.room) {
            const room = token.room;
            if ( (room.userId === room.initiator && room.initiatorIn) || (room.userId === room.partner && room.partnerIn)) {
                dispatch (joinRoom(token.room, token.token, token.identity, token.err))
            } else {
                dispatch (loadOpenRooms())
            }
        } 

        //todo - how to put in solo upon request 
    })
}

export const startPairPractice = () => dispatch => {
    //1.  get authToken
    axios.get('/api/rooms/token?status=start')
            .then(res => res.data)
            .then ( token => {
                //2.  set status, room name and auth_token onto the status
                if (token.err) {
                    dispatch(startPair({}, '', '', token.err))
                } else {
                    dispatch (startPair(token.room, token.token, token.identity, token.err))
                }
                 
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
                token.err?dispatch (joinRoom({}, '', '', token.err))
                :dispatch (joinRoom(token.room, token.token, token.identity, token.err))
                //history.push('/practice')
            })
            .catch(console.log);
}

export const endOpenedRoom= (roomName, target) => dispatch => {
    //1.  get authToken
        axios.get(`/api/rooms/token?status=close&room=${roomName}`)
            .then(res => res.data)
            .then ( token => {
                //2.  close room
                console.log('got room to close', token)
                dispatch (closeRoom(token.room, target))
                dispatch(loadOpenRooms());
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
    room: {},
    id: '',
    authToken: '', 
    err: undefined,
    rooms: [],
    waiting: false,
    history:{}
}

export default function (state=defaultState, action) {
    switch (action.type) {
        case START_SOLO: 
            return {...state, practiceStatus: 'solo'}
        case START_PAIR:
            return {...state, practiceStatus: action.err?"none":'pair_started', room: action.room, id: action.id, authToken: action.authToken, err: action.err}
        case JOIN_ROOM:
            return {...state, practiceStatus: action.err?"none":'pair_in_room', room: action.room, id: action.id, authToken: action.authToken, err: action.err}
        case UPDATE_ROOMS:
            const myRoom = action.rooms.find(room => room.initiator === store.getState().user.id )
            const newState = {...state, rooms: action.rooms}
            if (myRoom) newState.room = myRoom;
            return newState
        case CLOSE_ROOM: 
        case ROOM_CLOSED:
            return {...state, practiceStatus: 'none', room: {}, id: '', authToken: '', err:action.err }
        case CONTINUE_SOLO:
            return {...state, practiceStatus: 'solo', room: {}, id: '', authToken: '', err: action.err}
        case ROOM_WAITING:
            if (state.practiceStatus!=='pair_in_room') //do not update the state, already in room
                return {...state, waiting: 'true'}
            else return state;
        case LEAVE_ROOM:
            return {...state, practiceStatus: 'none', room: {}, id: '', authToken: '', err: action.err}
        case LOAD_HISTORY:
            return {...state, history:action.history}
        default: return state;
    }
}