var socket_events = function(app, io){

  io.sockets.on('connection', function(socket){

    socket.on('join-room', function(data){
      socket.set('room', data.room, function(){
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('request-current-pos');
        console.log("joined room"+ data.room);
      });
    });

    socket.on('move', function(data){
      socket.get('room', function(err, room){
        socket.broadcast.to(room).emit('move',data);
      });
    });


    socket.on('response-current-pos', function(data){
      var positions = data.positions;
      socket.get('room', function(err, room){
        positions.forEach(function(el){
          socket.broadcast.to(room).emit('move',el);
        });
      });
    });
  });

};

module.exports = socket_events;