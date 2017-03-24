var pg = require('pg');
var connectionString = require('../config/index').connectionString;

var client = new pg.Client(connectionString);
client.connect();
var query = client.query(
  "CREATE TABLE users(																												\
  		id 												Numeric 	NOT NULL,														\
  		github_access_token				TEXT			NOT NULL,														\
  		gitter_access_token				TEXT,																					\
	  	name 											TEXT		  NOT NULL,														\
	  	affiliation 							TEXT,																					\
	  	about 										TEXT,																					\
	  	role 											TEXT			NOT NULL,														\
	  	image 										TEXT			NOT NULL,														\
	  	portfolio 								TEXT 			NOT NULL,														\
	  	chat_link 								TEXT 			NOT NULL,														\
	  	PRIMARY KEY (id)																												\
	  );																																				\
																																							\
		CREATE TABLE announcements(																								\
	  	id 								SERIAL 						NOT NULL,														\
	  	header 						TEXT				 			NOT NULL,														\
	  	message 					TEXT							NOT NULL,														\
	  	timestamp 				TEXT				 			NOT NULL,														\
	  	user_id						INTEGER						NOT NULL,														\
	  	PRIMARY KEY (id),																  											\
	  	Foreign KEY (user_id) REFERENCES users(id) ON DELETE CASCADE						\
	  );																																				\
																																							\
		CREATE TABLE courses(																											\
	  	id 								SERIAL 						NOT NULL,														\
	  	title 						TEXT				 			NOT NULL,														\
	  	source 						TEXT				 			NOT NULL,														\
	  	description 			TEXT							NOT NULL,														\
	  	image 						TEXT				 			NOT NULL,														\
	  	course_link 			TEXT 							NOT NULL,														\
	  	chat_link 				TEXT 							NOT NULL,														\
	  	PRIMARY KEY (id)																												\
	  );																																				\
																																							\
		CREATE TABLE users_courses(																								\
	  	course_id 				INTEGER 					NOT NULL,														\
	  	user_id 					INTEGER     			NOT NULL,														\
	  	PRIMARY KEY (course_id, user_id),																				\
	  	Foreign KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,		    \
	  	Foreign KEY (user_id) REFERENCES users(id)		 ON DELETE CASCADE				\
	  );",
	function(err, result) {
		if (err) {
			console.log(err);
		}
	}
);
query.on('end', () => { client.end(); });