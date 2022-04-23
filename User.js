const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    location: {type: String, required: true, unique: false}
    });
    
module.exports = mongoose.model('User', UserSchema);