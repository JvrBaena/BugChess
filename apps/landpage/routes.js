
var routes = function(app){
  app.get('/', function(req, res){
    res.render(__dirname + '/views/landpage', {title: 'BugChess', stylesheet: 'landpage'});
  });
};

module.exports = routes;