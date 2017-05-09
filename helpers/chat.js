function chat(socket){
  console.log('A user connected')

  socket.on('messageUpload', message => {
  	socket.emit('messageUpdate', message)
  })

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })

}

module.exports = chat