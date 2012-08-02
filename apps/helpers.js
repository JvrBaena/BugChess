var helpers = function(app){
  app.dynamicHelpers({
   messages: require('express-messages') 
  });
};

module.exports = helpers;