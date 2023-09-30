// Node server handling socket.io connection
const express = require('express');
const http = require('http');
const PORT =process.env.PORT || 8000;
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:'*'
    }
});

app.use(express.static(path.join(__dirname, 'pages')));
// const io = require('socket.io')(PORT, {
//     cors:{
//         origin:'*'
//     }
// });


const users = {};
io.on('connection', socket=>{                        //listens to all different socket connections; like different people joining.
    socket.on('new-user-joined', Name=>{            //listens and handles on what should happen with one particular connection.
        users[socket.id] = Name;                    //as someone joined, make sokcet-id=name
        socket.broadcast.emit('user-joined',Name);  //Tell to all the people already joined, that a new user joined.
    });

    socket.on('send', message =>{
        socket.broadcast.emit('recieve',{message:message, name:users[socket.id]}); //send the message to everyone
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]); 
        delete users[socket.id];
    }); 
    server.listen(PORT, ()=>{
        console.log(`listening on ${PORT}`)
    })
    app.listen(PORT, ()=>{
        console.log(`listening on ${PORT}`);
    })
})
