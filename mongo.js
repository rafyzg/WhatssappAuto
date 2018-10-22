const mongoClient = require('mongodb').MongoClient;
const mPort = 27017; //Mongo port
const dbName = "WhatssappWeb"; //Database name
var url = "mongodb://localhost:" + mPort + "/";
var db = null; 


mongoClient.connect('mongodb://localhost:27017/', function(err, client) {
    if(err) { console.error(err) }
    else {
        console.log("Connected successfully to DB");
    }
    db = client.db(dbName);
});

/*
Function for inserting the message to the Database, inserts the ip of the sender, receiver name, 
message tex and Date.
*/
exports.insertMessage = function(ip, name, text) {

    if(db != null) {
        var obj = { sender: ip, receiver: name, text: text, date: new Date(Date.now()) , readDate: null };
        db.collection("Messages").insertOne(obj, (err,res) => { //Inserts the document
            if(err) {
                throw err;
            } else {
                console.log("1 Doc inserted to Messages collection");
            }

            
        });
    }

}
/*
Function for inserting the block to the databse - inserts the Ip of the blocker,
the blocked person and Date.
*/
exports.insertBlock = function(ip, blocked) {

    if(db != null) {
        var obj = { userIp: ip, receiver: blocked, date: new Date(Date.now())};
        db.collection("Blocks").insertOne(obj, (err,res) => { //Inserts the document
            if(err) {
                throw err;
            } else {
                console.log("1 Doc inserted to Blocks collection");
            }

            
        });
    }

}

/*
function for inserting a group to the databse. 
Insertes the ip of the group creator, members, title and Date.
*/
exports.insertGroup = function(ip, members, title) {

    if(db != null) {
        var obj = { userIp: ip, members: members, title: title , date: new Date(Date.now())};
        db.collection("Groups").insertOne(obj, (err,res) => { //Inserts the document
            if(err) {
                throw err;
            } else {
                console.log("1 Doc inserted to Groups collection");
            }
        });
    }

}
