const fs = require ('fs')
const socketInit = (function initSocket ()  {
  const openRoomsByRoomName = new Map();
  const openRoomsBySocketId = new Map();
  const openRoomsByUserId = new Map()
  const Files = {}

  let object = null;
  function init(io) {
    io.on('connection', (socket) => {

      console.log(`A socket connection to the server has been made: ${socket.id}`)

      socket.on('disconnect', () => {
        console.log(`Connection ${socket.id} has left the building`)
        if (openRoomsBySocketId.has(socket.id)) {
          const room = openRoomsBySocketId.get(socket.id)
          const roomName = room.name;
          const userId = room.userId;
          openRoomsBySocketId.delete(socket.id)
          openRoomsByUserId.delete(userId);
          if (openRoomsByRoomName.has(roomName)) 
            openRoomsByRoomName.set(roomName, openRoomsByRoomName.get(roomName).filter(room=>room.socket.id !== socket.id));
          else 
            openRoomsByRoomName.delete(roomName)
        }
      })

      socket.on ('draw', (start, end, color) => {
        const roomName = openRoomsBySocketId.get(socket.id).room.name;
        console.log("-----DRAW", roomName)
        socket.broadcast.to(roomName).emit('receivedDraw', start, end, color)
      });

      socket.on('text', text => {
        const roomName = openRoomsBySocketId.get(socket.id).room.name;
        socket.broadcast.to(roomName).emit('receivedText', text);
      })

      socket.on('solo-mode', () => {
        //1.  broadcast to your room that you left
       // console.log("leaving the room", socket)
        const roomx = openRoomsBySocketId.get(socket.id);
        if (roomx) {
          const roomName = roomx.room.name;
          socket.broadcast.to(roomName).emit('left-room');
          const rooms = openRoomsByRoomName.get(roomName)
          rooms.forEach(room => {
            const roomSocket = room.socket;
            const userId = room.userId;

            openRoomsByRoomName.delete(roomName);
            openRoomsBySocketId.delete(roomSocket.id);
            openRoomsByUserId.delete(userId)
            roomSocket.leave(roomName);
          });
        }
      })
      
      socket.on ('chat-message-added', applicationIds => {
        console.log("applicationIds have updated chats", applicationIds)
        socket.broadcast.emit('chat-updated', applicationIds)
      })
      socket.on('join', (room, userId, schedToken) => {
        console.log ('---socket join received---', openRoomsByRoomName, room, userId, schedToken)
        if (room && (!openRoomsByRoomName.has(room.name) || openRoomsByRoomName.get(room.name).length <= 2)) {
          console.log('room not there or less than two participants')
          socket.join(room.name);
          if (!openRoomsByRoomName.has(room.name)) openRoomsByRoomName.set(room.name, [{room, userId, socket}]);
          else openRoomsByRoomName.get(room.name).push({room, userId, socket})
      
          openRoomsBySocketId.set(socket.id, {room, userId, socket})
          openRoomsByUserId.set(userId, {room, userId, socket})
          //if not the initiator, send notification that room should be removed
          if (openRoomsByRoomName.get(room.name).length === 2 || openRoomsByRoomName.get(room.name)[0].room.initiator != userId) {
            socket.broadcast.emit ('room-unavailable');
          }

          //if (openRoomsByRoomName.get(room.name)[0].room.initiator != userId) {
            console.log("emitting room waiting")
            socket.broadcast.to(room.name).emit('room-waiting');
         // }
        } else {
          console.log ("ROOM IS NULLLLLL!!!!!!!!!!!!!!!!!!!!!")
        }
      })

      socket.on('start-room', (room) => {
        console.log("start-room event received", room)
        socket.join(room.name)
        socket.broadcast.emit('started-room', room)
      })

      socket.on('close-room', (room, target) => {
        console.log('close room event received', room, target)
        
        if (target === 'all') {
          console.log("emitting close for all")
          socket.broadcast.emit('room-closed', room, target);
        } else if (room) {
          console.log("emitting close for room", room.name)
          socket.broadcast.to(room.name).emit('room-closed', room, target)
        } else {
          console.log("someting terrible has happened....", target, room)
        }
        if(room) socket.leave(room.name)
        
      })


      socket.on('start-file-upload', function (data) { //data contains the variables that we passed through in the html file
        const Name = data['name'];
        Files[Name] = {  //Create a new Entry in The Files Variable
            FileSize : data['size'],
            Data     : "",
            Downloaded : 0
        }
        var Place = 0;
        let Stat
        try{
            Stat = fs.statSync(__dirname+'/../../tempImages/' +  Name);
            if(Stat.isFile())
            {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            } else {
              console.log("Is Stat a file: (socket.io)", Stat)
            }
        }
        catch(er){} //It's a New File
        console.log("wrote some file", Name, (Stat?Stat.size:Stat), data.size)
        if (Stat && Stat.size >= data.size) {
          socket.emit('more-data', {percent: 100})
        } else {
          fs.open(__dirname+'/../../tempImages/' +  Name, "a", 0755, function(err, fd){
            if(err)
            {
                console.log(err);
            }
            else
            {
                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                socket.emit('more-data', { place : Place, percent : 0 });
                console.log("Sent more data request to server", Place)
            }
        });
        }
        
        socket.on('upload-video', function (data){
          //console.log ("got upload video", data)
          var Name = data['name'];
          Files[Name]['Downloaded'] += data['data'].length;
          Files[Name]['Data'] += data['data'];
          if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
          {
              fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                  //Get Thumbnail Here
              });
              
              socket.emit('more-data', {percent: 100})
              
              //console.log("File is FULLY DOWNLOADED")
          }
          else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
              fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                  Files[Name]['Data'] = ""; //Reset The Buffer
                  var Place = Files[Name]['Downloaded'] / 524288;
                  var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                  console.log("percent", Percent)
                  socket.emit('more-data', { place : Place, percent :  Percent});
              });
          }
          else
          {
              var Place = Files[Name]['Downloaded'] / 524288;
              var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
              console.log("percent", Percent)
              socket.emit('more-data', { place : Place, percent :  Percent});
          }
      });
});




    })}

  return function initialize (io) {
    if (!object) {
      init(io);
      object = true;
    }
  }
})();

module.exports = socketInit;