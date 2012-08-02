var md5 = require('MD5');
var redis = require('redis').createClient();


module.exports = (function(){

  function Room(p1,p2){
    this.id = md5(Date.now().toString());
    this.p1 = p1;
    this.p2 = p2;
    return this;
  };

  Room.prototype.save = function(cb){
    var me = this;
    redis.hset("rooms:" + process.env.NODE_ENV , me.id, JSON.stringify(me), function(err, code){
      cb(null, me);
    });
  };

  return Room;

})();
