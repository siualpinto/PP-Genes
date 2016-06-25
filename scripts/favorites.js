var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database


function addFavorites(email){ 
	if(email=='null'){
		window.alert("Para adicionar aos favoritos deve estar logado no site");
	}
	else{

	// define the schema for our user model
	var userSchema = mongoose.Schema({

		local        : {
			email        : String,
			password     : String,
			favorites    : [String],
		}

	});

	var conditions = { 'local.email' : "teste@teste.pt"}
  , update =  { $push: { 'local.favorites': {id:"gene2"}}}
  , options = { multi : false,  // update only one document 
        upsert : false  /* insert a new document, if no existing document match the query */ };
        function callback (err, numAffected) {
  // numAffected is the number of updated documents
};

mongoose.model.update(conditions, update, options, callback);
}
}


var insertDocument = function(db, callback) {
	
	db.getCollection('users').update(
    // query 
    {
    	"local.email" : "teste@teste.pt"
    },
    
    // update 
    {
    	$push: { 'local.favorites': {id:"gene2"}}
    },
    
    // options 
    {
        "multi" : false,  // update only one document 
        "upsert" : false  // insert a new document, if no existing document match the query 
    }
    );

};
/*
db.collection('users').insertOne( {
	"address" : {
		"street" : "2 Avenue",
		"zipcode" : "10075",
		"building" : "1480",
		"coord" : [ -73.9557413, 40.7720266 ]
	},
	"borough" : "Manhattan",
	"cuisine" : "Italian",
	"grades" : [
	{
		"date" : new Date("2014-10-01T00:00:00Z"),
		"grade" : "A",
		"score" : 11
	},
	{
		"date" : new Date("2014-01-16T00:00:00Z"),
		"grade" : "B",
		"score" : 17
	}
	],
	"name" : "Vella",
	"restaurant_id" : "41704620"
}, function(err, result) {
	assert.equal(err, null);
	console.log("Inserted a document into the restaurants collection.");
	callback();
});*/


		//console.log(user.local.email);
		//console.log("teste");
		//window.alert(user.local.email);
		

  //alert( "Handler for .click() called." );
  
