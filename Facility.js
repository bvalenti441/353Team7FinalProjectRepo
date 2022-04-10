const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const url = 'mongodb+srv://bvalenti:<zeFgBhp7pStJrhDo>@cluster0.l9y2m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url);

var facilitySchema = new Schema({
	name: {type: String, required: true, unique: true},
	id: {type: Number, required: true, unique: true},
    address: String,
    insurance: [String],
    phone: Number,
    admitting: {type: Boolean, required: true, unique: false}
    });

facilitySchema.methods.standardizeName = function() {
        this.name = this.name.toLowerCase();
        return this.name;
}

const Model = mongoose.model('Facility', facilitySchema);
// Explicitly create the collection before using it
// so the collection is capped.
Model.createCollection();



