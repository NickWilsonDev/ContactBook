// Require the Express web framework for routing ect.
var express = require('express');

// body-parser is used to parse the Request body and populate the req
var bodyParser = require('body-parser');

// mongoose is used to interact with MongoDB
var mongoose = require('mongoose');

var Contact = require('./models/contact');

// Connect to contactList MongoDB
mongoose.connect('mongodb://localhost:27017/contactList');

var app = express();
app.set('port', 8080);

// Make Express app use BodyParser to parse JSON request bodies
app.use(bodyParser.json());

var
