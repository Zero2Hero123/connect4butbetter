const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')

const app = express();
app.use(cors())
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET','POST']
    }
});

io.on("connection", (socket) => {
  console.log(socket.id)

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

  socket.on('send-username',(name) => {
    socket.broadcast.emit('update-opp-user',name)
  })

  socket.on('play-move', (moveObj) => {
    socket.broadcast.emit('opp-move',moveObj)
    socket.broadcast.emit('switch-turns')
  })

  socket.on('win',color => {
    socket.broadcast.emit('opp-won',color)
  })

});

// io.of("/").adapter.on("join-room", (room, id,userName) => {
//     console.log(`socket ${id} has joined room ${room}`);

//     io.to(room).emit('new-join',{userName: userName})
    
//   });

httpServer.listen(3001,() => {
    console.log("listening!")
});