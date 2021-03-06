exports = module.exports = {}
const db = require('../helpers/db-connect')

exports.join = function(io){
  io.on('connect', socket => {
    socket.on('join', room => {
      socket.join(room)
    })
  })
}
  
exports.newMessage = function(io){
  return (req, res) => {
    db.query('INSERT INTO messages (sender, receiver, message, timestamp) VALUES ($1, $2, $3, $4)', 
    [req.body.sender, req.body.receiver, req.body.message, Date.now()], (err) => {
      if(err) console.log(err)
      const room = [req.body.sender, req.body.receiver].sort().join('_')
      io.sockets.in(room).emit('newMessage')
      res.end()
    })
  }
} 

exports.getMessages = (req, res) => {
  db.query('SELECT * FROM messages WHERE (sender=$1 AND receiver=$2) OR (sender=$1 AND receiver=$2)', 
  [req.params.user1, req.params.user2], (err, response) => {
    if(err) console.log(err)
    res.json(response.rows)
  })
}

exports.getChats = (req, res) => {
  db.query('SELECT * FROM messages WHERE sender=$1 OR receiver=$1', 
  [req.params.userId], (err, response) => {
    if(err) console.log(err)
    // Separtate messages into chats
    let chats = {}
    response.rows.forEach(message => {
      let added = false
      let id = message.sender
      if(id === req.params.userId) 
        id = message.receiver
      for(var prop in chats){
        if(prop === id){
          chats[prop].push(message)
          added = true
        }
      }
      if(!added){
        chats[id] = [message]
      }
    })
    res.json(chats)
  })
}


