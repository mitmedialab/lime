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

## Database Setup

Next you will need to setup a local instance of the database. Start by creating an empty database named lime. Do this from the main lime/ directory.

```
$ cd ../
$ psql
	username=> CREATE DATABASE lime;
	username=> \q
```



### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc