const router = require('express').Router()
const {firebase} = require ('../db')
const nodemailer = require ('nodemailer');
const moment = require ('moment')
const generateRoomName = require ('./roomnameGenerator');
module.exports = router

router.get('/', (req, res, next) => {
    //console.log(req.user)
    const id = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    //console.log("User id:", id)
    if (id) {
        firebase.database()
        .ref('schedule/')
        .once('value')
        .then(ds => {
          //const sched = {};
          const sched = [];
          const sess = ds.val()
          console.log(sess)
          const sessIds = Object.keys(sess);
          //const arr = [];
          sessIds.forEach (sessId => {
            //arr.push(userSess[sessId])
            sched.push(sess[sessId])
          })
          console.log('sched from firebase', sched);
          res.json(sched);
        })
        .catch(err => {
            console.log(err);
            res.json([])
        })
    } else {
        res.json({err: 'Must be logged in to see history'})
    }
})

//used to pair with an available session
router.put('/', (req, res, next) => {
    const userId = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    const session = req.body;
    if (userId) {
        //1.  look up the original user in firebase
        console.log("looking up sched", userId, session.id)
        const sessionId = session.id;
        const userOne = session.userOne
        firebase.database()
                .ref('/schedule/')
                .orderByKey()
                .equalTo(sessionId)
                .once('value')
                .then (ds => ds.val())
                .then (openSess => {
                    if (openSess) {
                        return firebase.database().ref('/schedule/'+sessionId)
                        .update({userTwo: userId})     
                        .then(() => {
            
                            openSess[sessionId].userTwo = userId;
                            //send email notifications
                            sendEmailToUser(openSess[sessionId].userOne, openSess[sessionId])
                            sendEmailToUser(openSess[sessionId].userTwo, openSess[sessionId])

                           
                            console.log("session updated....", openSess)
                            return openSess;
                        })
                    } else {
                        console.log("Session not found", session.id)
                        return {err: "Session no longer available"}
                    }
                })
                .then (data => {
                    res.json(data)
                })
                .catch (err => {
                    console.log(err)
                    res.json({err})
                })
    } else {
        res.json({err: "Must be logged in to pair practice"})
    }
})

//used to add a new schedule to DB
router.post('/', (req, res, next) => {
    const userId = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    const roomName = generateRoomName ();
    if (userId) {
        const ref = firebase.database().ref('schedule/');
        const batch = {};
        const sessions = req.body;
        sessions.forEach (session => {
            session.roomName = roomName;
            session.token = Date.now();
            batch[session.id] = session

        })

        ref.update(batch)
        .then(() => {
            res.json(sessions)
        })
        .catch(err => {
            console.log(err)
            res.json({err})
        })
    } else {
        res.json({err: 'Must be logged in to see history'})
    }
})

const sendEmailToUser = (userId, session) =>  {
    firebase.database().ref('/users')
                            .orderByKey()
                            .equalTo(userId)
                            .once('value')
                            .then(ds => ds.val())
                            .then(user => {
                                sendEmail(user[userId].username, 'You have scheduled a practice session!', session)
                            })
}

const sendEmail = (userEmail, subject, session) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'workitappfs@gmail.com',
        pass: 'workitappf'
      }
    });
    
    const mailOptions = {
      from: 'workitappfs@gmail.com',
      to: userEmail,
      subject: subject,
      text: formatText(session)
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  const formatText = (session) => {
        let localTime = moment.utc(session.start, 'HH:mmm').toDate();
        localTime = moment(localTime).format('HH:mm')
        return `You have a practice session coming up on ${session.date} at ${localTime} for 1 hour. \n You may access your pracitce sesstion at http://localhost:8080/practice/${session.roomName}?token=${session.token}  \n Please, be on time!`
  }