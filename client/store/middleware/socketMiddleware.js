import { updateWhiteboard,  clearWhiteboard, EMIT_DRAW_EVENT} from '../../components/interview-board/whiteboard-reducer';
import { updateTextarea, clearTextarea,  EMIT_TEXT_EVENT} from '../../components/interview-board/textarea-reducer';
import { JOIN_ROOM, START_PAIR, loadOpenRooms, CLOSE_ROOM, START_SOLO, continueSolo, roomWaiting, endOpenedRoom, LEAVE_ROOM, roomClosed } from '../../components/practice-pairs/practice-reducer';

import io from 'socket.io-client';
const socket = io (window.location.origin);

export default () => {
    socket.on ('connect', function () {
        console.log("Socket connected!");
    });

    return store => {
        //handle from server events
        socket.on('receivedDraw', (start, end, color) => {
            console.log("receivedDraw emitted")
           store.dispatch(updateWhiteboard(start, end, color));
        })

        socket.on('receivedText', (text)=>{
            store.dispatch(updateTextarea(text));
        })

        socket.on('started-room', room => {
            console.log('-----------------------started-room event received')
            store.dispatch(loadOpenRooms())
        })

        socket.on('room-closed', (room, target) => {
            console.log("on room closed")
            if(target !== 'all') {
                store.dispatch(roomClosed(room))
                store.dispatch(clearTextarea())
                store.dispatch(clearWhiteboard())
            }
            store.dispatch(loadOpenRooms())
        })

        socket.on('left-room', () => {
            store.dispatch(continueSolo())
        })

        socket.on('room-waiting', () => {
            store.dispatch(roomWaiting())
            store.dispatch(loadOpenRooms())
        })
        //handle events to server
        return next => action => {
            switch (action.type) {
                case EMIT_DRAW_EVENT:
                    socket.emit ('draw', action.start, action.end, action.color);
                    break;
                case EMIT_TEXT_EVENT:
                    socket.emit ('text', action.text);
                    store.dispatch(updateTextarea(action.text))
                    break;
                case JOIN_ROOM:
                    console.log("joining...", action)
                    socket.emit('join', action.room, store.getState().user.id);
                    break;
                case START_PAIR:
                    console.log('-----------------emitting start-room', action)
                    socket.emit('start-room', action.room)
                    break;
                case CLOSE_ROOM:
                    socket.emit('close-room', action.room, action.target)
                    store.dispatch(clearTextarea())
                    store.dispatch(clearWhiteboard())
                    break;
                case START_SOLO:
                    socket.emit('solo-mode')
                    if (store.getState().practice.room.name)
                        store.dispatch(endOpenedRoom(store.getState().practice.room.name))
                    break;
                case LEAVE_ROOM:
                    socket.emit('solo-mode')
                    if (action.room) store.dispatch(endOpenRoom(action.room.name))
                    break;

            }
            next (action);
        }
    }
}

