# LIME: Learning Innovators - Middle East

Learning Innovators Middle East is a capacity-building program developed by the [MIT Media Lab Learning Initiative](http://learn.media.mit.edu/). The innovation accelerator will train and enable a cohort of learning technology developers in the Middle East to develop education solutions for refugees.

The project will work with bright young people from the Middle East region, who already have some tech proficiency and an interest in further developing these skills. They will be offered online courses on digital pedagogy, and refugee education; the program incorporates project-based learning, mentorship and an emphasis on peer-to-peer learning.

Checkout the live version of [LIME](http://lime.media.mit.edu/)

## Getting Started

### Prerequisites

* [node.js](https://nodejs.org/)
* [postgresql](https://www.postgresql.org/)

### Installation

Start by cloning the repository and installing dependencies

```
$ git clone https://github.com/ml-learning/lime.git
$ cd lime
$ npm install

```
Then initialize the [lemon submodule](https://github.com/ml-learning/lemon/) and install its dependencies. Lemon is the client side of LIME.

```
$ cd lemon/
$ git submodule init
$ git submodule update
$ npm install
```
Now the frontend side is ready and the submodule is linked to the main repository. For more information about submodules, refer to the [git documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

### Database Setup

Next you will need to setup a local instance of the database. Start by creating an empty database named lime. Do this from the main lime/ directory.

```
$ cd ../
$ psql
 username=> CREATE DATABASE lime;
 username=> \q
```

Then seed the database with default data. Make sure you run the script below from /lime.

```
$ USERNAME=your-psql-username npm run seed
```

The local database is now set up and seeded.

### Configuration  

The only thing left to do is to configure the location of the database and gitter and gitlab's ids and secrets. Create an empty file.

```
$ cd config/
$ touch index.js
```
Then open index.js and paste the following into it. 

```
module.exports.connectionString = 'postgres://username:password@localhost:5432/lime';

module.exports.gitlabClientId = 'xxxxxxxxxxxxxxxxxxbf0';
module.exports.gitlabClientSecret = 'xxxxxxxxxxxxxxxxxxcc1';

module.exports.gitterClientId = 'xxxxxxxxxxxxxxxxxxdf3';
module.exports.gitterClientSecret = 'xxxxxxxxxxxxxxxxxx75d';

module.exports.homepageUri = 'http://127.0.0.1:3001';
module.exports.sessionSecret = 'super super secret';
```

In the first line, the username and password are those you use to access psql. 

You will need to register your application with gitlab and gitter to get the client secret and id above. Keep those secret and do not push them into public repositories. 

Follow [this documentation](https://docs.gitlab.com/ee/integration/oauth_provider.html) for registering an OAuth app with gitlab and a similar process is used for gitter. The callback urls should be http://127.0.0.1:3001/auth/gitlab/callback and http://127.0.0.1:3001/auth/gitter/callback for local development. 

## Running Locally 

First go through the setup in Getting Started. Once all the set up is done, there are two ways of running LIME. To run the client side and proxy requists to the server side, do the following:

```
$ cd lime/
$ npm start
```
The system will be running at localhost:3000. 

To run the frontend from statically built files and see what the running deployment would behave, do the following:

 ```
$ cd lime/
$ npm run build
$ npm run server
```
The system will be running at localhost:3001. 

Refer to [this tutorial](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) for a discription of how static rendering is done in this repository.

## Deployment

This repository is deployed at [lime.media.mit.edu](http://lime.media.mit.edu/). It is deployed on an ubuntu VPS. The set up is the same as in the Getting Started section, the only difference is that all instances of localhost:3001 or 127.0.0.1:3001 in the Getting Started section should be replaced with your domain name (lime.media.mit.edu in our case).

Additionally, the following two Digital Ocean articles may be helpful in setting up the VPS:
1. [Setting up PostgreSQL and running the database](https://www.digitalocean.com/community/tutorials/how-to-secure-postgresql-on-an-ubuntu-vps)
2. [Setting up a Node.js application for production](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

## Built With

* [React](https://facebook.github.io/react/) - User Interface
* [Redux](http://redux.js.org/) - State Container
* [Express](https://expressjs.com/) - Node.js Web Framework
* [PostgreSQL](https://www.postgresql.org/) - Database

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

We would like to thank the third part course providers whose online courses we are using. Thank you for offering open source and free courses.
* [Free Code Camp](https://www.freecodecamp.com/)
* [Flatiron School](https://flatironschool.com/)
* [Udacity](https://www.udacity.com/)
