// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var Facility = require('./Facility.js');
const req = require('express/lib/request');

var facilities = new Map();
facilities.set(1234, new Facility('Haverford Medical Association', 1234, '937 E Haverford Rd, Haverford, PA 19041', ['Medicare', 'Horizon Blue Cross Blue Shield'], '(610) 527-8844', true));
facilities.set(5678, new Facility('AFC Urgent Care - Havertown', 5678, '115 W Eagle Rd, Havertown, PA 19083', ['Progressive', 'Geico'], '(484) 452-9400', true));
facilities.set(0987, new Facility('Morris Infirmary (Health Services)', 0987, 'Walton Ln, Ardmore, PA 19003', [], '(610) 896-1089', false));

/***************************************/
// endpoint for creating a new person
// this is the action of the "create new person" form
app.use('/create', (req, res) => {
	// construct the Facility from the form data which is in the request body
	var newFacility = new Facility ({
		name: req.body.name,
		id: Date.now(),
		address: req.body.address,
		insurance: req.body.insurance,
		phone: req.body.phone,
		admitting: req.body.admitting
	    });

	// save the person to the database
	newFacility.save( (err) => { 
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfull created" message
		    res.send('successfully added ' + newFacility.name + ' to the database');
		}
	    }); 
    });

// endpoint for showing all the facilities, sorted alphabetically by name
app.use('/all', (req, res) => {
    Facility.find( {}, (err, facilities) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (facilities.length == 0) {
			res.type('html').status(200);
			res.write('There are no facilities');
			res.end();
			return;
		    }
		    else {
			res.type('html').status(200);
			res.write('Here are the Facilities in the database:');
			res.write('<ul>');
			// show all the people
			facilities.forEach( (facility) => {
			    res.write('<li>');
			    res.write('ID: ' + facility.id + '; name: ' + facility.name + '; admitting: ' + facility.admitting);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/delete?name=" + facility.name + "\">[Delete]</a>");
			    res.write('</li>');
			
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    }).sort({ 'name': 'asc' }); // this sorts them BEFORE rendering the results
});

app.use('/delete', (req, res) => {

	var filter = { 'name' : req.query.name };

	Facility.findOneAndDelete( filter, (err, facility) => {
		if (err) { 
		   res.json( { 'status' : err } ); 
		   res.redirect('/all');
		}
		else if (!facility) {
		   res.json( { 'status' : 'no facility' } ); 
		}
		else {
		   res.json( { 'status' : 'success' } ); 
		}
	});
});

app.use('/find', (req, res) => {

	var filter = { 'name' : req.query.name };

	Facility.findOne( filter, (err, facility) => {
		if (err) { 
		   res.json( { 'status' : err } ); 
		   res.redirect('/all');
		}
		else if (!facility) {
		   res.json( { 'status' : 'no facility' } ); 
		}
		else {
		   res.json(facility); 
		}
	});
});

app.use('/new', (req, res) => {

	var newFacility = new Facility ({
		name: req.query.name,
		address: req.query.name,
		insurance: req.query.insurance,
		phone: req.query.phone,
		admitting: req.query.admitting
	    });

	newFacility.save( (err) => { 
		if (err) {
		    console.log(err);
			res.json( { 'status' : 'error' });
		}
		else {
		    // display the "successfull created" message
		    res.json( { 'status' : 'success' } );
		}
	    } ); 
})



// endpoint for accessing data via the web api
// to use this, make a request for /api to get an array of all Person objects
// or /api?name=[whatever] to get a single object
app.use('/api', (req, res) => {

	// construct the query object
	var queryObject = {};
	if (req.query.name) {
	    // if there's a name in the query parameter, use it here
	    queryObject = { "name" : req.query.name };
	}
    
	Facility.find( queryObject, (err, facilities) => {
		if (err) {
		    console.log('uh oh' + err);
		    res.json({});
		}
		else if (facilities.length == 0) {
		    // no objects found, so send back empty json
		    res.json({});
		}
		else if (facilities.length == 1 ) {
		    var facility = facilities[0];
		    // send back a single JSON object
		    res.json( { "name" : facility.name , "address" : facility.address } );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    facilities.forEach( (facility) => {
			    returnArray.push( { "name" : facility.name, "address" : facility.address } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
		
	    });
    });


/*************************************************/

app.use('/Public', express.static('Public'));

app.use('/', (req, res) => { res.redirect('/Public/facilityform.html'); } );

app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
