module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on ('draw', (start, end, color) => {
      socket.broadcast.emit('receivedDraw', start, end, color)
    });

    socket.on('text', text => {
      socket.broadcast.emit('receivedText', text);
    })
  })
}
