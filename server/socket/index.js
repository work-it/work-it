module.exports = (io) => {
  const openRoomsByRoomName = new Map();
  const openRoomsBySocketId = new Map();
  io.on('connection', (socket) => {

    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
      if (openRoomsBySocketId.has(socket.id)) {
        const roomName = openRoomsBySocketId.get(socket.id)
        openRoomsBySocketId.delete(socket.id)
        if (openRoomsByRoomName.get(roomName) >  1) 
          openRoomsByRoomName.set(roomName, 1)
        else 
          openRoomsByRoomName.delete(roomName)
      }
    })

    socket.on ('draw', (start, end, color) => {
      const roomName = openRoomsBySocketId.get(socket.id);
      socket.broadcast.to(roomName).emit('receivedDraw', start, end, color)
    });

    socket.on('text', text => {
      const roomName = openRoomsBySocketId.get(socket.id);
      socket.broadcast.to(roomName).emit('receivedText', text);
    })

    socket.on('join', roomName => {
      if (!openRoomsByRoomName.has(socket.id)) {
        socket.join(roomName);
        openRoomsByRoomName.set(roomName, 1);
        openRoomsBySocketId.set(socket.id, roomName)
      } else if (openRoomsByRoomName.get(socket.id) === 1) {
        socket.join(roomName);
        openRoomsByRoomName.set(roomName, 2);
        openRoomsBySocketId.set(socket.id, roomName)
      } 
    })
  })
}
