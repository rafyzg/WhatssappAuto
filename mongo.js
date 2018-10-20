const mongoClient = require('mongodb').MongoClient;
const mPort = 27017;
const dbName = "WhatssappWeb";
var url = "mongodb://localhost:" + mPort + "/";
var db = null;


mongoClient.connect('mongodb://localhost:27017/', function(err, client) {
    if(err) { console.error(err) }
    else {
        console.log("Connected successfully to DB");
    }
    db = client.db(dbName);
});

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


exports.connectDB = function() {
    mongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if(err) { console.error(err) }
        else {
            console.log("Connected successfully to DB");
        }
        db = client.db(dbName);
        return true;
    });
}