// Require the Express web framework for routing ect.
var express = require('express');

// body-parser is used to parse the Request body and populate the req
var bodyParser = require('body-parser');

// mongoose is used to interact with MongoDB
var mongoose = require('mongoose');

// use specified data schema
var Contact = require('./models/contact');

// Connect to contactList MongoDB
mongoose.connect('mongodb://localhost:27017/contactList');

var app = express();

// tell server where to look for static files
app.use(express.static(__dirname + "/public"));

// Make Express app use BodyParser to parse JSON request bodies
// allows us to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080; // set port


var Contact = require('./models/contact');

// ROUTES for API
var router = express.Router();

// middleware to use for all requests
// can do validation, logging (for analytics statistics ect) if we wish
router.use(function(req, res, next) {
    // do logging
    console.log('------------ Request Body fix later querystring?------------');
    //console.log(req.body.key);
    next(); // go to next routes, dont stop here
});


// test route, use GET
router.get('/', function(req, res) {
    console.log("index is being accessed");
    res.json({ message: 'hooray! welcome to our api!' });
});


// REGISTER OUR ROUTES -----------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.route('/contacts')

    /* POST for adding a new contact */
    .post(function(req, res) {
        var contact = new Contact();
        contact.name = req.body.name;
        contact.number = req.body.number;
        contact.email = req.body.email;
        contact.notes = req.body.notes;
        contact.carrier = req.body.carrier; // may need to evaluate to boolean?

        // save contact and check for errors
        contact.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Contact created!' });
        });
    })


    /* GET for returning all contacts (http://localhost:8080/api/contacts) */
    .get(function(req, res) {
        Contact.find(function(err, contacts) {
            if (err)
                res.send(err);

            res.json(contacts);
        });
    });

// ----------------- routes of form /contacts/:contact_id
router.route('/contacts/:contact_id')

    // GET return a specific contact by id
    .get(function(req, res) {
        Contact.findById(req.params.contact_id, function(err, contact) {
            if (err)
                res.send(err);
            res.json(contact);
        });
    })

    // PUT for updating contacts
    .put(function(req, res) {
        // use our contact model to find contact that we want to update
        Contact.findById(req.params.contact_id, function(err, contact) {
            if (err)
                res.send(err);

            // update contact's details
            contact.name = req.body.name;
            contact.number = req.body.number;
            contact.email = req.body.email;
            contact.notes = req.body.notes;
            contact.carrier = req.body.carrier; // may need to evaluate to boolean?
   
            // save contact
            contact.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Contact updated!' });
            });
        });
    })

    // delete contact with given id
    .delete(function(req, res) {
        Contact.remove({
            _id: req.params.contact_id
        }, function(err, contact) {
            if (err)
                res.send(err);

            res.json({ message: "Successfully deleted" });
        });
    });


// help link to index.html for angular/frontend side
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load this single view file
});

app.listen(port);
console.log("Server running on port " + port);
