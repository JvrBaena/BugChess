var redis = require('redis').createClient();
var Room = require('../../models/room');

var routes = function(app){

  app.post('/rooms', function(req, res){
    if(!req.body.name || req.body.name === ""){
      req.flash("error", "You must provide a name");
      res.redirect("/");
    }else{
      var room = null;
      redis.hkeys("rooms:" + process.env.NODE_ENV, function(err, keys){
        if(keys.length){ //Si tenemos rooms por rellenar
          redis.hget("rooms:" + process.env.NODE_ENV, keys[0], function(err, _room){
            json = JSON.parse(_room);
            room = new Room(json.p1,req.body.name);
            room.id = json.id;
            req.session.player = req.body.name;
            room.save(function(err, obj){
              // Guardamos la room llena
              redis.incrby("playing:" + process.env.NODE_ENV, 1,function(err, total){
                  //Incrementamos las rooms que están jugando
                  redis.hdel("rooms:" + process.env.NODE_ENV, keys[0], function(err, delobj){
                    //Borramos la room de las que están esperando
                    redis.hset("fullrooms:" + process.env.NODE_ENV, obj.id, JSON.stringify(obj), function(err, fullroom){
                      //La guardamos en fullrooms
                      res.redirect("/rooms/" + obj.id);
                      return;
                    });
                  });
              });
            });
          });
        }else{
          req.session.player = req.body.name;
          room = new Room(req.body.name, null);
          room.save(function(err, room){
              req.flash("info", "Please wait for other players to come");
              res.redirect("/rooms/" + room.id);
              return;
          });
        }
      });
    }
  });
  
  app.get('/rooms/:id', function(req, res){
    redis.hget("fullrooms:" + process.env.NODE_ENV, req.params.id, function(err, json){

      var room = JSON.parse(json);
      if(room && (req.session.player !== room.p1 && req.session.player !== room.p2)){
        req.flash("error", "Room is full");
        res.redirect("/");
      }else{
        res.render(__dirname + '/views/room',{title: "BugChess Game", stylesheet: "room", room: req.params.id});
      }
    })
  });
};

module.exports = routes;