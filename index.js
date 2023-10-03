// Node server handling socket.io connection
const PORT = process.env.PORT || 8000;
const io = require('socket.io')(PORT , {
    cors:{
        origin:'*'
    }
});
console.log(PORT);
const users = {};
io.on('connection', socket=>{                        //listens to all different socket connections; like different people joining.
    socket.on('new-user-joined', Name=>{            //listens and handles on what should happen with one particular connection.
        users[socket.id] = Name;                    //as someone joined, make sokcet-id=name
        socket.broadcast.emit('user-joined',Name);  //Tell to all the people already joined, that a new user joined.
    });
    console.log('First one executed');
    socket.on('send', message =>{
        socket.broadcast.emit('recieve',{message:message, name:users[socket.id]}); //send the message to everyone
    });
    console.log('Second one executed');
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]); 
        delete users[socket.id];
    }); 
    console.log('Third one executed');
    
});


