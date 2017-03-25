var axios = require('axios');

var fork_portfolio = function(token, cb) {
  console.log('token: ', token);
  var auth = 'Bearer '+token;
  var config = {
    headers: {
      'User-Agent': 'LIME',
      'Authorization': auth
    }
  }

  axios.post(
    'https://gitlab.com/api/v4/projects/2911776/fork', 
    {}, 
    config
  ).then(function(res) {
    console.log('Success!');
    cb(null, res.data);   
  }).catch(function(err) {
    console.log('Error!');
    console.log(err);
    cb(err.data, null);    
  }); 
}

var get_project_id = function(token, cb) {
  console.log('token: ', token);
  var auth = 'Bearer '+token;
  var config = {
    params: {
      'owned': true,
      'simple': true
    },
    headers: {
      'User-Agent': 'LIME',
      'PRIVATE-TOKEN': 'fBXUsU41TjB4A5VHz2ze'
    }
  }

  axios.get(
    'https://gitlab.com/api/v4/projects/',  
    config
  ).then(function(res) {
    console.log('Success!');
    var project_id = null;
    res.data.forEach(function (project) {
      if (project.name==='lime-portfolio') {
        project_id = project.id;
      }
    });
    cb(null, project_id);   
  }).catch(function(err) {
    console.log('Error!');
    console.log(err);
    cb(err.data, null);    
  }); 
}

var update_portfolio = function(token, project_id, name, username, cb) {
  var content = "# Site settings\n\
title: "+name+"\n\
description: 'Full Snack Developer' \n\
url: 'http://learn.media.mit.edu/' \n\
baseurl: '/lime-portfolio/' \n\
# google_analytics: 'UA-XXXXXX-X' \n\
# disqus_shortname: 'your-disqus-name' \n\
author: \n\
  name: '"+name+"' \n\
  email: "+username+"@gmail.com \n\
  twitter_username: "+username+" \n\
  facebook_username: "+username+" \n\
  github_username:  "+username+" \n\
  linkedin_username:  "+username+" \n\
defaults:\n\
  -\n\
    scope:\n\
      path: ''\n\
      type: 'posts'\n\
    values:\n\
        layout: 'post'\n\
# Build settings\n\
destination: _site\n\
paginate: 10\n\
permalink: /:year/:title/\n\
markdown: kramdown\n\
highlighter: rouge\n\
kramdown:\n\
  # use Github Flavored Markdown\n\
  input: GFM\n\
  # do not replace newlines by <br>s\n\
  hard_wrap: false\n\
gems: ['jekyll-paginate']\n\
exclude: ['README.md', 'Gemfile', 'Gemfile.lock', 'screenshot.png']"

  var auth = 'Bearer '+token;
  var config = {
    headers: {
      'User-Agent': 'LIME',
      'Authorization': auth
    }
  }

  axios.put(
    'https://gitlab.com/api/v4/projects/'+project_id+'/repository/files/_config%2Eyml', 
    {
      branch: 'master',
      content: content,
      commit_message: 'updating _config.yml with user information'
    }, 
    config
  ).then(function(res) {
    console.log('Success!');
    cb(null, res.data);   
  }).catch(function(err) {
    console.log('Error!');
    console.log(err);
    cb(err.data, null);    
  }); 
}

module.exports.fork_and_setup_portfolio = function(token, name, username, cb) {
  fork_portfolio(token, function(error, result) {
    if(error) {
      return cb(error, null);
    }

    if (result) {
      get_project_id(token, function(err, id) {
        if (err) {
          return cb(err, null);
        }

        if (id) {
          update_portfolio(token, id, name, username, function (er, res) {
            if (er) {
              return cb(er, null);
            }

            if (res) {
              return cb(null, res);
            }
          });
        }
      });
    }
  });
}



