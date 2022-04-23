// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var Facility = require('./Facility.js');
var User = require('./User.js');
const req = require('express/lib/request');
const crypto = require('crypto');

/*
Mock Data
set(1234, new Facility('Haverford Medical Association', 1234, '937 E Haverford Rd, Haverford, PA 19041', ['Medicare', 'Horizon Blue Cross Blue Shield'], '(610) 527-8844', true));
set(5678, new Facility('AFC Urgent Care - Havertown', 5678, '115 W Eagle Rd, Havertown, PA 19083', ['Progressive', 'Geico'], '(484) 452-9400', true));
set(0987, new Facility('Morris Infirmary (Health Services)', 0987, 'Walton Ln, Ardmore, PA 19003', [], '(610) 896-1089', false));
*/

/***************************************/
app.use('/Public', express.static('Public'));

// endpoint for creating a new facility
// this is the action of the "create new facility" form

app.use('/createUser', (req, res) => {

	hash = crypto.getHashes();

	// construct the User from the http request body from mobile app
	var newUser = new User ({
		username: req.body.username,
    	password: crypto.createHash('sha1').update(req.body.password).digest('hex'),
		location: req.body.location
		});

	// save the person to the database
	newUser.save( (err) => { 
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
			// display the "successfully created" message
			res.send('successfully added ' + newUser.username + ' to the database');
		}
		}); 
	});

app.use('/login', (req, res) => {
	
	hash = crypto.getHashes();

	var filter = { 'username' : req.query.username, 
				   'password' : crypto.createHash('sha1').update(req.query.password).digest('hex')
				   };
	
	User.findOne( filter, (err, facility) => {
		if (err) 
			res.json( { 'status' : err } );
		else if (!facility) 
		   res.json( { 'status' : 'no user' } ); 
		else 
			res.json( { 'status' : 'valid user' } ); 
	});
});

app.use('/allUsers', (req, res) => {
    User.find( {}, (err, users) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		} else {
		    if (users.length == 0) {
				res.type('html').status(200);
				res.write('There are no users.');
				res.end();
				return;
		    } else {
				res.type('html').status(200);
				res.write('Here are the users in the database:');
				res.write('<ul>');
				// show all the people
				users.forEach( (user) => {
			    	res.write('<li>');
			    	res.write('Username: ' + user.username + '; Location: ' + user.location);
			    	// this creates a link to the /delete endpoint
			    	res.write(" <a href=\"/deleteUser?username=" + user.username + "\">[Delete]</a>");
			    	res.write('</li>');
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    }).sort({ 'location': 'asc' }); // this sorts them BEFORE rendering the results
});

app.use('/deleteUser', (req, res) => {

	var filter = { 'username' : req.query.username };

	User.findOneAndDelete( filter, (err, user) => {
		if (err) { 
		   res.json( { 'status' : err } ); 
		   res.redirect('/allUsers');
		}
		else if (!user) {
		   res.json( { 'status' : 'no user' } ); 
		}
		else {
		   res.json( { 'status' : 'success' } ); 
		}
	});
});

app.use('/newUser', (req, res) => {
	
	hash = crypto.getHashes();

	var newUser = new User ({
		username: req.query.username,
    	password: crypto.createHash('sha1').update(req.query.password).digest('hex'),
		location: req.query.location
		});

	newUser.save( (err) => { 
		if (err) {
			console.log(err);
			res.json( { 'status' : 'error' });
		} else {
			// display the "successfull created" message
			res.json( { 'status' : 'success' } );
		}
	}); 
})

app.use('/createFac', (req, res) => {
	admitBool = undefined;
	if(req.body.admitting == 'yes'){
		admitBool = true;
	} else if(req.body.admit == 'no'){
		admitBool = false;
	}
	// construct the Facility from the form data which is in the request body
	var newFacility = new Facility ({
		name: req.body.name,
		id: Date.now(),
		address: req.body.address,
		insurance: req.body.insurance,
		phone: req.body.phone,
		admitting: admitBool,
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
		    // display the "successfully created" message
		    res.send('successfully added ' + newFacility.name + ' to the database');
		}
	    }); 
    });

// endpoint for showing all the facilities, sorted alphabetically by name
app.use('/allFacs', (req, res) => {
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
			    res.write(" <a href=\"/deleteFac?name=" + facility.name + "\">[Delete]</a>");
			    res.write('</li>');
			
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    }).sort({ 'name': 'asc' }); // this sorts them BEFORE rendering the results
});

app.use('/deleteFac', (req, res) => {

	var filter = { 'name' : req.query.name };

	Facility.findOneAndDelete( filter, (err, facility) => {
		if (err) { 
		   res.json( { 'status' : err } ); 
		   res.redirect('/allFacs');
		}
		else if (!facility) {
		   res.json( { 'status' : 'no facility' } ); 
		}
		else {
		   res.json( { 'status' : 'success' } ); 
		}
	});
});

app.use('/findFac', (req, res) => {

	var filter = { 'name' : req.query.name };

	Facility.findOne( filter, (err, facility) => {
		if (err) { 
		   res.json( { 'status' : err } ); 
		   res.redirect('/allFacs');
		}
		else if (!facility) {
		   res.json( { 'status' : 'no facility' } ); 
		}
		else {
		   res.json(facility); 
		}
	});
});

app.use('/newFac', (req, res) => {

	var newFacility = new Facility ({
		name: req.query.name,
		id: Date.now(),
		address: req.query.address,
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
	}); 
})

// endpoint to update a facility
app.use('/updateFac', (req, res) => {
    const filter = { 'id' : req.body.id };
    const payload = {
        'name': req.body.name,
        'address': req.body.address,
        'insurance': req.body.insurance,
        'phone': req.body.phone,
        'admitting': req.body.admitting
    }

    Facility.findOneAndUpdate(filter, payload, (err, original) => {
        if (err) {
            res.json({'status': err});
        }
        else if (!original) {
            res.json({'status': 'facility not found'});
        }
        else {
            res.json({'status': 'success'});
        }
    });
});

// endpoint for accessing data via the web api
// to use this, make a request for /api to get an array of all Facility objects
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
		    res.json( { 'name' : facility.name , 'ID' : facility.id, 'address' : facility.address, 'insurance' : facility.insurance, 'phone' : facility.phone, 'admitting' : facility.admitting } );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    facilities.forEach( (facility) => {
			    returnArray.push( { 'name' : facility.name , 'ID' : facility.id, 'address' : facility.address, 'insurance' : facility.insurance, 'phone' : facility.phone, 'admitting' : facility.admitting } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
		
	    });
    });


/*************************************************/

app.use('/', (req, res) => { res.redirect('/Public/facilityform.html'); } );

app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
