const twilio = require('twilio'); 
const twilioClient = require ('../../secrets').twilioClient;
//const client = new twilio(twilioClient.accountSid, twilioClient.authToken);

const client = new twilio(twilioClient.keySid, twilioClient.keySecret, { accountSid: twilioClient.accountSid });
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const router = require('express').Router()
const openRoomsByRoomName = new Map();
const openRoomsByUserId = new Map();

module.exports = router
let counter = 0;

router.get('/token', (req, res, next) => {
    if (req.user) {
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
            //1. check, if the room is open.  if not, send error back
            if (openRoomsByRoomName.has(roomName)) {
                //get the room
                const room = openRoomsByRoomName.get(roomName);
                //check if the room is full (>2 participants)
                if (room.count > 2) {
                    cont = false;
                    err={err: "Room is full"}
                } else if (room.count===0)  {//If room is empty, let the person in
                    //close any other open room that he might have
                    if (openRoomsByUserId.has(user.id)) {
                        const oldRoom = openRoomsByUserId.get(user.id);
                        openRoomsByRoomName.delete (oldRoom.name);
                        openRoomsByUserId.delete (user.id);
                    }
                    room.count++;
                    if (room.initiator !== user.id ) {
                        room.partner = user.id
                    }
                    req.user.roomStatus='join'
                } else { //if there is one person, check if it's the initiator who is already there,  If not, don't let the new user join
                    if (room.partner) {
                        cont = false;
                        err={err: "Room cannot be entered.  Partner is waiting for initiator"}
                    } else if (room.initiator === user.id || room.partner === user.id) {
                        cont = false;
                        err={err: "Room has already been joined"}
                    } else {
                            //close any other open room that he might have
                        if (openRoomsByUserId.has(user.id)) {
                            const oldRoom = openRoomsByUserId.get(user.id);
                            openRoomsByRoomName.delete (oldRoom.name);
                            openRoomsByUserId.delete (user.id);
                        }
                        room.count++;
                        room.partner = user.id
                        req.user.roomStatus='join'
                    }
                }
                     
            } else {
                err = {err: "Room is not open"}
                cont = false;
            }
        } else if (status === 'start') {
            //1. Check if the user has a room opened.  If so, delete it.
            console.log("Room starting...", req.user)
            if (openRoomsByUserId.has(user.id)) {
                const openRoom = openRoomsByUserId.get(user.id);
                openRoomsByUserId.delete(user.id);
                openRoomsByRoomName.delete(openRoom.name)
            }
            roomName = generateRoomName();
            console.log("rooms.js Room starting...", roomName)
            const room = {name:roomName, initiator:user.id, partner: null, count: 0}
            openRoomsByRoomName.set(roomName, room)
            openRoomsByUserId.set(user.id, room)
            user.roomName = roomName;
            user.roomStatus='start'
        } else {
            err = {error: "Invalid status"};
            cont = false;
        }
 
        if (cont) {
            console.log("current rooms are: ", openRoomsByRoomName)
            const accessToken = new AccessToken(
                twilioClient.accountSid,
                twilioClient.keySid,
                twilioClient.keySecret
                );
                
            // Set the Identity of this token
            accessToken.identity = ""+(counter++);


            console.log("access token", accessToken.toJwt())

            res.json({
                identity: accessToken.identity,
                token: accessToken.toJwt(),
                roomName
            })
        }else {
            res.json(err);
        }
    } else {
        res.json({err: "Must be logged in to use interview rooms"})
    }
    console.log("current rooms", openRoomsByRoomName);
})

router.get('/', (req, res, next) => {
    console.log("filtering map", openRoomsByRoomName)
    const newMap = [];
    openRoomsByRoomName.forEach( (value, key)=> {
        //console.log("key", key, "value", value)
        if (value.count < 2) newMap.push(value)
        //console.log('newMap', newMap)
    })
    res.json(newMap);
})

const first = ['Mobile', 'Awesome','Mysterious', 'Tremendous', 'Creative', 'Agile'];
const second =['Blue', 'Black', 'Pink', 'Green', 'Purple', 'Red', 'Lavander'];
const third = ['Owl', 'Lion', 'Tiger', 'Wolf', 'Deer', 'Bear', 'Dolphin'];
const generateRoomName = () => {
    let roomName
    do {
        roomName = `${getRandom(first)}${getRandom(second)}${getRandom(third)}`;
    }  while (openRoomsByRoomName.has(roomName)) 

    return roomName
}
const getRandom = arr => {
    const randomIdx = Math.floor(Math.random()*arr.length)
    //console.log("randomIdx", randomIdx)
    return arr[randomIdx];
}

