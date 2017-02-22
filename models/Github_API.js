var axios = require('axios');

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
    console.log(res);
    cb(null, res.data);   
  }).catch(function(err) {
    console.log('Error!');
    console.log(err.data);
    cb(err.data, null);    
  }); 
}