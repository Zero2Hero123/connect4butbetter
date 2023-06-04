const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')

require('dotenv').config()

const checkForWin = require('./checkForWin')

const app = express();
app.use(cors())
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000",process.env.PROD_URL],
        methods: ['GET','POST']
    }
});

io.on("connection", (socket) => {
  console.log(socket.id)


  // listener for when a user joins a waiting user's room
  socket.on('join-room',async({roomId,userName}) => {
    socket.join(roomId)

    const roster = await (await io.in(roomId).fetchSockets()).map((s) => s.id)

    socket.broadcast.emit('new-user',{userName, userId: socket.id,color: 'red'})
      console.log(roster)
      if(roster.length >= 2){

        
        io.to(roster[0]).emit('set-color','red')
        io.to(roster[1]).emit('set-color','yellow')
        io.to(roomId).emit('start-game')

      }
  })

  // send opponents username
  socket.on('send-username',(name) => {
    socket.broadcast.emit('update-opp-user',name)
  })


  // update boards after a powerup used
  socket.on('update', (newBoard) => {
    socket.broadcast.emit('update-boards',newBoard)
  })

  // play a move sent from client
  socket.on('play-move', (moveObj,callback) => {
    socket.broadcast.emit('update-boards',moveObj.currBoard)

    console.time('checking for win')

    const didWin = checkForWin(moveObj.currBoard,moveObj.color)
/*  console.timeEnd('checking for win')
    console.log(didWin)

    console.log(moveObj.currBoard)
    */
    if(didWin){
      socket.broadcast.emit('win-event',moveObj.color);
      callback(true);
      return;
    }
    socket.broadcast.emit('switch-turns')



  })

  // POWER-UPS
  socket.on('power-up-used', (name) => {
    socket.broadcast.emit('opp-used',name)
  })

  // CHAT MESSAGING
  socket.on('new-message',(msg) => {
    socket.broadcast.emit("opp-new-message",msg)
    console.log(msg)
  })


  // when emitted, disconnect the ended game.
  socket.on('leave', () => {
    socket.disconnect();
  })

});

// io.of("/").adapter.on("join-room", (room, id,userName) => {
//     console.log(`socket ${id} has joined room ${room}`);

//     io.to(room).emit('new-join',{userName: userName})
    
//   });

httpServer.listen(3001,'0.0.0.0',() => {
    console.log("listening!")
});