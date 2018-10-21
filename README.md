# WhatssappAuto

A simple implemention for using Whatssapp using your web browser.
This application uses puppeteer in order to open chrome and operate all the necessary functions.
We have created a webserver using express. When a post request is sent to a certain url the data transfers to Rabbitmq Server.
Rabitmq server listens to the messages and executes using puppeteer. 


###### What can I do with it?
- Send a message to A person/Group in your chat. (Including emojis & tags)
- Create a group and add people to your group.
- Block a person


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

There are couple of things to need to install before running the application

**Express**

```
npm install express
```

**Mongodb**

```
npm install mongodb --save
```

**Puppeteer**

```
npm i puppeteer
```

**Body-parser**
```
npm install body-parser
```

Basically there are 2 main files you are going to use. 
The first is "server.js" - which is resposible for starting the server, and receiving the message throw the url.
The Second is - "receive.js" - which is ressposible for receiving the message, excuting task with puppeteer and logging it to mongo.

## Url Explained

I used postman for this kind of post requests.

-For Sending a message: 
```
http://localhost:1337/message/{Contact-Name}
Your body post request should have 'text' with the message content
```

-For blocking a person
```
http://localhost:1337/block/{Contact-Name}
```

-For Creating a new group
```
http://localhost:1337/message/{Group-Title}
Your body post request should have a 'users' array passed
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

## Built With

* [Express](https://expressjs.com/) - The web framework used
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Dependency Management
* [Rabbot](https://github.com/arobson/rabbot) - Used to pass message from Express to Puppeteer
* [MongoDB](https://github.com/mongodb/node-mongodb-native) - Used log all the functions

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Rafael Yzgeav** - *Initial work* - [RafYzg](https://github.com/RafYzg)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
