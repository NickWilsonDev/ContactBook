// Define 'Contact' model
var mongoose = require('mongoose');

// contact schema
var ContactSchema = new mongoose.Schema({
    name: String,
    number: String,
    email: String,
    notes: String,
    carrier: Boolean
});

// Export the Mongoose model
module.exports = mongoose.model('Contact', ContactSchema);
