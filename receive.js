#!/usr/bin/env node
const rabbit = require("rabbot");
const WhatssappAuto = require("./whatssappAuto");
const mongo = require("./mongo");
var auto = new WhatssappAuto(false);

rabbit.handle({queue: "whatssapp.q"}, (data) => {

  console.log(" [x] Received ", data.fields.routingKey);

  if(data.fields.routingKey == "message") { //Handeling message request
    auto.sendMessage(data.body.name , data.body.text).then((callback) => { //Calling puppeteer server
      if(callback == true) { //request handled successfully
          mongo.insertMessage(data.body.ip, data.body.name, data.body.text); //Inserting the data to mongodb
          data.ack(); //Delete message from queue
        }
      else { //Server didn't handled the request properly
        console.log("Rejected Message");
        data.ack();
      }
    });
  }

  else if(data.fields.routingKey == "group") { //Handling group request
    auto.createGroup(data.body.members, data.body.name).then((callback) =>  {
      if(callback == true) {
        mongo.insertGroup(data.body.ip, data.body.members, data.body.name);
        data.ack(); 
      }
      else {
        console.log("Rejected Group");
        data.ack();
      }
    });
  }

  else if(data.fields.routingKey == "block") { //Handling block request
    auto.blockPerson(data.body.name).then((callback)  => {
      if(callback == true) { //request handled successfully
        mongo.insertBlock(data.body.ip, data.body.name).then(() => {
          data.ack();
        });
      }
      else {
        console.log("Rejected Block");
        data.ack();
      }
    });
  }

  else {
    console.log("Received unknown");
  }

});


require('./config')(rabbit)
  .then(() => {
      console.log("logged successfully");

      rabbit.startSubscription("whatssapp.q","WhatssappAuto");
  });
