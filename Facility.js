const mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/myDatabase');

var facilitySchema = new Schema({
	name: {type: String, required: true, unique: true},
	id: {type: Number, required: true, unique: true},
    address: String,
    insurance: [String],
    phone: Number,
    admitting: Boolean
    });

module.exports = mongoose.model('Facility', facilitySchema);

facilitySchema.methods.standardizeName = function() {
        this.name = this.name.toLowerCase();
        return this.name;
}



