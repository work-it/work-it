import { updateWhiteboard,  EMIT_DRAW_EVENT} from '../../components/interview-board/whiteboard-reducer';
import { updateTextarea,  EMIT_TEXT_EVENT} from '../../components/interview-board/textarea-reducer';
import { JOIN_ROOM, START_PAIR } from '../../components/interview-container/save-state-reducer';

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
                case START_PAIR:
                    socket.emit('join', roomName);
            }
            next (action);
        }
    }
}

