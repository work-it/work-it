import { updateWhiteboard,  clearWhiteboard, EMIT_DRAW_EVENT} from '../../components/interview-board/whiteboard-reducer';
import { updateTextarea, clearTextarea,  EMIT_TEXT_EVENT} from '../../components/interview-board/textarea-reducer';
import { saveState } from '../../components/interview-container/save-state-reducer'
import { NOTIFY_OF_UPDATE, fetchSchedule} from '../../components/practice-schedule/practice-schedule-reducer'
import { videoUploaded, UPLOAD_VIDEO, START_FILE_UPLOAD, VIDEO_UPLOADED, pushVideoToFirebase, ADD_MESSAGE, fetchEmployerJobsThunk, fetchAppsWithProfilesThunk,fetchApplicationsThunk, REVIEW, INTERVIEW, OFFER, OFFER_STATUS, APPLY} from '../index'
import { JOIN_ROOM, START_PAIR, loadOpenRooms, CLOSE_ROOM, START_SOLO, continueSolo, roomWaiting, endOpenedRoom, LEAVE_ROOM, roomClosed } from '../../components/practice-pairs/practice-reducer';
import { hideLogin } from '../../components/auth/auth-reducer'
import { GET_USER } from '../user'

import io from 'socket.io-client';
const socket = io (window.location.origin);
let SelectedFile, reader

export default () => {
    socket.on ('connect', function () {
        console.log("Socket connected!");
    });

    return store => {
        //handle from server events
        socket.on('receivedDraw', (start, end, color, action) => {
            console.log("receivedDraw emitted", start, end, color, action)
           store.dispatch(updateWhiteboard(start, end, color, action));
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
                store.dispatch(saveState())
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

        socket.on ('chat-updated', applicationIds => {
            const currentApplicationIds = store.getState().applications.map(application => application.id);
            const isEmployer = store.getState().user.employer;
            const userId = store.getState().user.id
            applicationIds.forEach(applicationId => {
                if (currentApplicationIds.includes(applicationId)) {
                    if (isEmployer)
                        store.dispatch(fetchAppsWithProfilesThunk(userId))
                    else
                        store.dispatch(fetchApplicationsThunk(userId))
                }
            })
        })

        socket.on ('applications-updated', applicationIds => {
            console.log("got application to update", applicationIds)
            const currentApplicationIds = store.getState().applications.filter(app=>app).map(application => application.id);
            const isEmployer = store.getState().user.employer;
            const userId = store.getState().user.id
            applicationIds.forEach(applicationId => {
                if (currentApplicationIds.includes(applicationId)) {
                   // console.log("found application that needs to be updated")
                    if (isEmployer)
                        store.dispatch(fetchAppsWithProfilesThunk(userId))
                    else
                        store.dispatch(fetchApplicationsThunk(userId))
                }
            })
        })

        socket.on ('update-schedule', session => {
            //console.log ("updating schedule", session);
            const userId = store.getState().user.id
            if (!session || session.userOne === userId || session.userTwo === userId || session.intervieweeId === userId) {
                store.dispatch(fetchSchedule());
            }

        })

        socket.on('update-applications', function (employerIds) {
            const userId = store.getState().user.id
            console.log("should update be triggered for employer?", employerIds, userId)
            if (employerIds.includes(userId)) {
                store.dispatch(fetchEmployerJobsThunk(userId))
                store.dispatch(fetchAppsWithProfilesThunk(userId))
            }
                  
        })

        socket.on('more-data', function (data){
            //UpdateBar(data['Percent']);
            if (data.percent === 100) {
                store.dispatch(videoUploaded(SelectedFile.name))
            } else {
                var place = data['place'] * 524288; //The Next Blocks Starting Position
                var NewFile; //The Variable that will hold the new Block of Data
                if(SelectedFile.webkitSlice)
                    NewFile = SelectedFile.webkitSlice(place, place + Math.min(524288, (SelectedFile.size-place)));
                else if (SelectedFile.mozSlice)
                    NewFile = SelectedFile.mozSlice(place, place + Math.min(524288, (SelectedFile.size-place)));
                else
                    NewFile = SelectedFile.slice(place, place + Math.min(524288, (SelectedFile.size-place)));
                console.log("Got NewFile to read", NewFile, place)
                reader.readAsBinaryString(NewFile);
            }
        });

        //handle events to server
        return next => action => {
            switch (action.type) {
                case EMIT_DRAW_EVENT:
                    socket.emit ('draw', action.start, action.end, action.color, action.action);
                    break;
                case EMIT_TEXT_EVENT:
                    socket.emit ('text', action.text);
                    store.dispatch(updateTextarea(action.text))
                    break;
                case JOIN_ROOM:
                    console.log("joining...", action)
                    //the only time user id might not exist is if the user is accessing the room through the link
                    //in this case joining takes place before the user state updated, so we're hacking it a bit
                    const userId = store.getState().user.id?store.getState().user.id:action.room.initiator
                    socket.emit('join', action.room, userId, action.token);
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
                    if (store.getState().practice.room.name && store.getState().practice.practiceStatus==='pair_in_room')
                        store.dispatch(endOpenedRoom(store.getState().practice.room.name))
                    break;
                case LEAVE_ROOM:
                    socket.emit('solo-mode')
                    if (action.room) store.dispatch(endOpenRoom(action.room.name))
                    break;
                case UPLOAD_VIDEO:
                    socket.emit('upload-video', action.info);
                    console.log("Upload video event emitted")
                    break;
                case START_FILE_UPLOAD:
                    SelectedFile = action.file;
                    console.log('SelFi', SelectedFile, SelectedFile.name)
                    reader = action.reader
                    socket.emit ('start-file-upload', action.info)
                    break;
                case VIDEO_UPLOADED:
                    console.log("action in video uploaded", action.name)
                    store.dispatch(pushVideoToFirebase(action.name))
                    break
                case ADD_MESSAGE:
                    console.log ("adding message")
                    socket.emit ('chat-message-added', action.updatedApplications.map(application => application.id))
                    break;
                case REVIEW: case INTERVIEW: case OFFER: case OFFER_STATUS:
                    //console.log("updatedApplications in review", action.updatedApplication)
                    socket.emit ('application-status-update', action.updatedApplications.map(application => application.id))
                    break;
                case NOTIFY_OF_UPDATE:
                    socket.emit ('schedule-update', action.session)
                    break;
                case GET_USER:
                    store.dispatch(hideLogin());
                    break;
                case APPLY:
                    const empIdMap = action.updateApplications.map(app=>app.employerId)
                    console.log("sending empId notification", empIdMap)
                    socket.emit ('applied', empIdMap)
                    break;

            }
            next (action);
        }
    }
}

