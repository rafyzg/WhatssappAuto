var express = require('express');
const bodyParser = require('body-parser');
const rabbit = require("rabbot");
const app = express();
const ePort = 1337; //Express port

//Setting the RabbitMQ enviroment
require('./config')(rabbit).then(() => {
        console.log('connected to Rabbit');
    })
    .then(null, (err) => {
        console.log("RabbitMQ Connection Error!");
        console.log(err.stack);
    });

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/cssFiles', express.static(__dirname + '/views')); // Including cssFiles

//Default Page..
app.get('/', (request,response) => {
    response.end(JSON.stringify("Server is on"));
});

//Handling Block request
app.post('/block/:user', (req,resp) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //returns the ip of user
    var data = { //Setting the data that will be sent to Rabbit
        routingKey: "block",
        contentType: "application/json",
        body: { name: req.params.user, ip: ip}
     };

    rabbit.publish("whatssapp.exchange", data, "WhatssappAuto") //Publishing the data to RabbitMQ
    .then(() => {
        console.log(' [x] sent: Block request');
    })
    .catch((err) => { //Incase of an Error
        console.log(err);
    });
    
    resp.end(JSON.stringify(req.body));
});

//Handling Message request
app.post('/message/:user', (req,resp) => { 
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var data = {
        routingKey: "message",
        contentType: "application/json",
        body: { name: req.params.user, text: req.body.text, ip: ip }
    }

    rabbit.publish("whatssapp.exchange", data, "WhatssappAuto") //Publishing data to rabbitMQ
    .then(() => {
        console.log(req.params.user);
        console.log(' [x] sent: Message request');
    })
    .catch((err) => {
        console.log(err);
    });
    
    resp.end(JSON.parse(req.body.text));
});

//Handling Group request
app.post('/group/:title', (req,resp) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var data = { //Setting the data that will be sent
        routingKey: "group",
        contentType: "application/json",
        body: { name: req.params.title, members: req.body.users, ip: ip }
    }

    rabbit.publish("whatssapp.exchange", data, "WhatssappAuto") //Publishing data to RabbitMQ
    .then(() => {
        console.log(' [x] sent: Group request');
    })
    .catch((err) => {
        console.log(err);
    });

    resp.end(JSON.stringify(req.body));
});

//Running the server
app.listen(ePort, () => {
    console.log('Listening on port ' + ePort);
});
