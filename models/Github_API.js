// ------------------------------------------------------------------ //
// The Github Model                                                   //
// The model for mapping github APIs into a JavaScript module methods //
// ------------------------------------------------------------------ //

//import axios for making http calls 
var axios = require('axios');

/**
 * forks the personal portfolio from the ml-learning repository to the user 
 * with the specified github token
 * @param token the user github token who we are forking the portfolio on their behalf
 * @param cb a callback function to be called once the github api returns
 **/
module.exports.fork_portfolio = function(token, cb) {
  var auth = 'token '+token;
  var config = {
    headers: {
      'User-Agent': 'LIME',
      'Authorization': auth
    }
  }

  axios.post(
    'https://api.github.com/repos/ml-learning/lime-portfolio/forks', 
    {}, 
    config
  ).then(function(res) {
    console.log('Success!');
    cb(null, res.data);   
  }).catch(function(err) {
    console.log('Error!');
    cb(err.data, null);    
  }); 
}