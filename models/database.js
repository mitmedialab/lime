var pg = require('pg');
var connectionString = require('../config/index').connectionString;

var client = new pg.Client(connectionString);
client.connect();
var query = client.query(
  "CREATE TABLE users(																																	\
  		id 												Numeric 	NOT NULL,																			\
  		gitlab_access_token				TEXT			NOT NULL,																			\
  		github_access_token				TEXT,																										\
  		gitter_access_token				TEXT,																										\
	  	name 											TEXT		  NOT NULL,																			\
	  	affiliation 							TEXT,																										\
	  	about 										TEXT,																										\
	  	role 											TEXT			NOT NULL,																			\
	  	image 										TEXT			NOT NULL,																			\
	  	portfolio 								TEXT,																										\
	  	chat_link 								TEXT,																										\
	  	deleted 									BOOL			DEFAULT FALSE,																\
	  	PRIMARY KEY (id)																																	\
	  );																																									\
																																												\
		CREATE TABLE announcements(																													\
	  	id 								SERIAL 						NOT NULL,																			\
	  	header 						TEXT				 			NOT NULL,																			\
	  	message 					TEXT							NOT NULL,																			\
	  	timestamp 				TEXT				 			NOT NULL,																			\
	  	user_id						INTEGER						NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id),																  																\
	  	Foreign KEY (user_id) REFERENCES users(id) ON DELETE CASCADE											\
	  );																																									\
																																												\
		CREATE TABLE courses(																																\
	  	id 								SERIAL 						NOT NULL,																			\
	  	title 						TEXT				 			NOT NULL,																			\
	  	source 						TEXT				 			NOT NULL,																			\
	  	description 			TEXT							NOT NULL,																			\
	  	image 						TEXT				 			NOT NULL,																			\
	  	course_link 			TEXT 							NOT NULL,																			\
	  	chat_link 				TEXT 							NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id)																																	\
	  );																																									\
																																												\
		CREATE TABLE users_courses(																													\
	  	course_id 				INTEGER 					NOT NULL,																			\
	  	user_id 					INTEGER     			NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (course_id, user_id),																									\
	  	Foreign KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,		    					\
	  	Foreign KEY (user_id) REFERENCES users(id)		 ON DELETE CASCADE									\
	  );																																									\
																																												\
		CREATE TABLE activities(																														\
	  	id 								SERIAL 						NOT NULL,																			\
	  	title 						TEXT				 			NOT NULL,																			\
	  	description 			TEXT,																														\
	  	example			 			TEXT,																														\
	  	image 						TEXT,																														\
	  	chat_link 				TEXT,																														\
	  	timestamp 				TEXT,																														\
	  	course_id					INTEGER,																												\
	  	expert_id					INTEGER,																												\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id),																  																\
	  	Foreign KEY (course_id) REFERENCES courses(id),																		\
	  	Foreign KEY (expert_id) REFERENCES users(id)																			\
	  );																																									\
																																												\
		CREATE TABLE requirements(																													\
	  	id 								SERIAL 						NOT NULL,																			\
	  	description 			TEXT				 			NOT NULL,																			\
	  	activity_id				INTEGER 					NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id),																  																\
	  	Foreign KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE							\
	  );																																									\
																																												\
		CREATE TABLE objectives(																														\
	  	id 								SERIAL 						NOT NULL,																			\
	  	description 			TEXT				 			NOT NULL,																			\
	  	activity_id				INTEGER 					NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id),																  																\
	  	Foreign KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE							\
	  );																																									\
																																												\
		CREATE TABLE submissions(																														\
	  	id 								SERIAL 						NOT NULL,																			\
	  	title							TEXT,																														\
	  	description 			TEXT,																														\
	  	gitlab_link				TEXT,																														\
	  	gdoc_link					TEXT,																														\
	  	image							TEXT,																														\
	  	timestamp 				TEXT,																														\
	  	user_id						INTEGER 					NOT NULL,																			\
	  	activity_id				INTEGER 					NOT NULL,																			\
	  	deleted 					BOOL							DEFAULT FALSE,																\
	  	PRIMARY KEY (id),																  																\
	  	Foreign KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,											\
	  	Foreign KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE							\
	  );",
	function(err, result) {
		if (err) {
			console.log(err);
		}
	}
);
query.on('end', () => { client.end(); });