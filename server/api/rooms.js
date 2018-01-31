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
    console.log(req)
    if (req.user) {
        const status = req.query.status;
        let roomName
        let cont = true;
        let err = {}
        if (status === 'join') {
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
                    if (openRoomsByUserId.has(req.user.uid)) {
                        const oldRoom = openRoomsByUserId.get(req.user.uid);
                        openRoomsByRoomName.delete (oldRoom.name);
                        openRoomsByUserId.delete (req.user.uid);
                    }
                    room.count++;
                    if (room.initiator !== req.user.uid ) {
                        room.partner = req.user.uid
                    }
                    req.user.roomStatus='join'
                } else { //if there is one person, check if it's the initiator who is already there,  If not, don't let the new user join
                    if (room.partner) {
                        cont = false;
                        err={err: "Room cannot be entered.  Partner is waiting for initiator"}
                    } else if (room.initiator === req.user.uid || room.partner === req.user.uid) {
                        cont = false;
                        err={err: "Room has already been joined"}
                    } else {
                            //close any other open room that he might have
                        if (openRoomsByUserId.has(req.user.uid)) {
                            const oldRoom = openRoomsByUserId.get(req.user.uid);
                            openRoomsByRoomName.delete (oldRoom.name);
                            openRoomsByUserId.delete (req.user.uid);
                        }
                        room.count++;
                        room.partner = req.user.uid
                        req.user.roomStatus='join'
                    }
                }
                     
            } else {
                err = {err: "Room is not open"}
                cont = false;
            }
        } else if (status === 'start') {
            //1. Check if the user has a room opened.  If so, delete it.
            if (openRoomsByUserId.has(req.user.uid)) {
                const openRoom = openRoomsByUserId.get(req.user.uid);
                openRoomsByUserId.delete(req.user.uid);
                openRoomsByRoomName.delete(openRoom.name)
            }
            roomName = generateRoomName();
            const room = {name:roomName, initiator:req.user.uid, partner: null, count: 0}
            openRoomsByRoomName.set(roomName, room)
            openRoomsByUserId.set(req.user.uid, room)
            req.user.roomName = roomName;
            req.user.roomStatus='start'
        } else {
            err = {error: "Invalid status"};
            cont = false;
        }
 
        if (cont) {
            const accessToken = new AccessToken(
                twilioClient.accountSid,
                twilioClient.keySid,
                twilioClient.keySecret
                );
                
            // Set the Identity of this token
            accessToken.identity = ""+(counter++);

            // Grant the access token Twilio Video capabilities.
            const grant = new VideoGrant();
            accessToken.addGrant(grant);

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
    const newMap = [];
    openRoomsByRoomName.forEach( (key, value)=> {
        if (value.count < 2) newMap.push(value)
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
    console.log("randomIdx", randomIdx)
    return arr[randomIdx];
}

