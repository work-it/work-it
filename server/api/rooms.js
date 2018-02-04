const twilio = require('twilio'); 
const twilioClient = require ('../../secrets').twilioClient;
//const client = new twilio(twilioClient.accountSid, twilioClient.authToken);
const generateRoomName = require ('./roomnameGenerator')
const client = new twilio(twilioClient.keySid, twilioClient.keySecret, { accountSid: twilioClient.accountSid });
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const router = require('express').Router()
const openRoomsByRoomName = new Map();
const openRoomsByUserId = new Map();
const openRoomsInProgress = new Map()
module.exports = router
let counter = 0;

router.get('/token', (req, res, next) => {
    if (req.user) {
        let room;
        let user = req.user;
        if (!user.id) {
            user = {
                id: Object.keys(req.user)[0]
            }
        }
        const status = req.query.status;
        let roomName
        let cont = true;
        let err = {}
        if (status === 'join') {
            console.log("joining room", req.query.room)
            roomName = req.query.room;
            const schedToken = req.query.token;
            //1. check, if the room is open.  if not, send error back
            if (!schedToken && (openRoomsByRoomName.has(roomName) || openRoomsInProgress.has(roomName))) {
                //get the room
                room = openRoomsByRoomName.has(roomName)?openRoomsByRoomName.get(roomName):openRoomsInProgress.get(roomName)
            
                //check if the room is full (>2 participants)
                if (room.count > 2) {
                    cont = false;
                    err={err: "Room is full"}
                } else if (room.count===0)  {//If room is empty, let the person in
                    //close any OTHER open room that he might have
                    if (openRoomsByUserId.has(user.id)) {
                        const oldRoom = openRoomsByUserId.get(user.id);
                        if (oldRoom.name !== roomName) {
                            openRoomsByRoomName.delete (oldRoom.name);
                            openRoomsByUserId.delete (user.id);
                        }
                        
                    }
                    room.count++;
                    if (room.initiator !== user.id ) {
                        room.partner = user.id
                        console.log("---------- PARTNER JOINED -------")
                        room.partnerIn = true;
                        openRoomsInProgress.set(roomName, room)
                        openRoomsByRoomName.delete(roomName);
                        openRoomsByUserId.delete(user.id)
                    } else {
                        console.log("INITIATOR JOINED")
                        room.initiatorIn = true;
                    }
                    req.user.roomStatus='join'
                } else { //if there is one person, check if it's the initiator who is already there,  If not, don't let the new user join
                    if (room.partner && room.initiator !== user.id) {
                        cont = false;
                        err={err: "Room cannot be entered.  Partner is waiting for initiator"}
                    // } else if (room.initiator === user.id || room.partner === user.id) {
                    //     cont = false;
                    //     err={err: "Room has already been joined"}
                    } else {
                            //close any other open room that he might have
                        if (openRoomsByUserId.has(user.id)) {
                            const oldRoom = openRoomsByUserId.get(user.id);
                            if (oldRoom.name !== roomName) {
                                openRoomsByRoomName.delete (oldRoom.name);
                                openRoomsByUserId.delete (user.id);
                            }
                        }
                        room.count++;
                        if (!room.partner) {
                            room.partner = user.id
                            room.partnerIn = true;
                            openRoomsInProgress.set(roomName, room)
                            
                        } else {
                            room.initiatorIn = true;
                        }
                        openRoomsByUserId.delete(roomName);
                        openRoomsByRoomName.delete(roomName);
                        req.user.roomStatus='join'
                    }
                }
                     
            } if (schedToken) {
                if (openRoomsByUserId.has(user.id)) {
                    const openRoom = openRoomsByUserId.get(user.id);
                    openRoomsByUserId.delete(user.id);
                    openRoomsByRoomName.delete(openRoom.name)
                }
                //case 1:  first user, room is not there yet
                if (!openRoomsInProgress.has(roomName)){
                    room = {name:roomName, initiator:user.id, partner: null, count: 1, initiatorIn: true, partnerIn: false}
                    openRoomsInProgress.set(roomName, room)
                    
                } else {
                     //case 2: second user, room is there already
                    room = openRoomsInProgress.get(roomName);
                    room.partner = user.id;
                    room.partnerIn = true;
                    room.count++;
                }            
                user.roomName = roomName;
                user.roomStatus='joined' 
                user.schedToken=schedToken 
            }else {
                err = {err: "Room is not open"}
                cont = false;
            }
        } else if (status === 'start') {
            //1. Check if the user has a room opened.  If so, delete it.
            //console.log("Room starting...", req.user)
            if (openRoomsByUserId.has(user.id)) {
                const openRoom = openRoomsByUserId.get(user.id);
                openRoomsByUserId.delete(user.id);
                openRoomsByRoomName.delete(openRoom.name)
            }
            roomName = generateRoomName();
            //console.log("rooms.js Room starting...", roomName)
            room = {name:roomName, initiator:user.id, partner: null, count: 0, initiatorIn: false, partnerIn: false}
            openRoomsByRoomName.set(roomName, room)
            openRoomsByUserId.set(user.id, room)
            user.roomName = roomName;
            user.roomStatus='start'
        } else if (status === 'close') {
            roomName = req.query.room;
            if (openRoomsByRoomName.has(roomName)) {
                room = openRoomsByRoomName.get(roomName)
            } else if (openRoomsInProgress.has(roomName)){
                room = openRoomsInProgress.get(roomName)
            }
            openRoomsByRoomName.delete(roomName)
            openRoomsByUserId.delete(user.id)
            openRoomsInProgress.delete(roomName)
            console.log("closing room", room)
        } else if (status === 'fetch') {
            room = openRoomsByUserId.get(user.id)
            if (room) {
                room.userId = user.id
            }
        }
        
        else {
            err = {error: "Invalid status"};
            cont = false;
        }
 
        if (cont) {
            const toSend = {
                room
            }
            if (status === 'join') {
                const accessToken = new AccessToken(
                    twilioClient.accountSid,
                    twilioClient.keySid,
                    twilioClient.keySecret
                    );

                const videoGrant = new VideoGrant({room: roomName});
                accessToken.addGrant(videoGrant);    
                // Set the Identity of this token
                accessToken.identity = ""+(counter++);
                toSend.identity = accessToken.identity;
                toSend.token = accessToken.toJwt();
                console.log('token in rooms.js', toSend)
            } else {
                console.log("sending basic room to user", toSend)
            }

            res.json(toSend)
        }else {
            res.json(err);
        }
    } else {
        res.json({err: "Must be logged in to use interview rooms"})
    }
})

router.get('/', (req, res, next) => {

    const newMap = [];
    openRoomsByRoomName.forEach( (value, key)=> {
        //console.log("key", key, "value", value)
        if (value.count < 2) newMap.push(value)
        //console.log('newMap', newMap)
    })
    res.json(newMap);
})


