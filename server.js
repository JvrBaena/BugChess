
/**
 * Module dependencies.
 */

var express = require('express'),
  RedisStore = require('connect-redis')(express),
  Room = require('./models/room');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // Usamos redis para sesiones
  app.use(express.session({
    secret: "unodostrescuatroycinco",
    store: new RedisStore
  }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', 3000);
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function(){
  app.set('port', 3001);
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Helpers
require('./apps/helpers')(app);

// Routes
require('./apps/landpage/routes')(app);
require('./apps/rooms/routes')(app);

//Socket.io events
require('./apps/socket-events')(app, io);

app.listen(app.settings.port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
