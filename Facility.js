var Schema = mongoose.Schema;

var facilitySchema = new Schema({
	name: {type: String, required: true, unique: true},
	id: {type: number, required: true, unique: true},
    address: String,
    insurance: [String],
    phone: number,
    admitting: Boolean
    });

facilitySchema.methods.standardizeName = function() {
        this.name = this.name.toLowerCase();
        return this.name;
}

import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://bvalenti:<password>@cluster0.l9y2m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // export facilitySchema as a class called Facility
    module.exports = mongoose.model('Facility', facilitySchema);
    client.close();
});

