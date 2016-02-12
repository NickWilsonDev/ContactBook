/**
 * users.js
 */

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Function accepts password as parameter, and salts and hashes it
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Function encrypts and salts the password given as a parameter and compares
// the output to the stored hash.
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};




