/*Settings*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(session({secret: 'qvqewdxwxqeq4swrts', resave: false, saveUninitialized: false}));

//body-parser - This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 

app.use(express.static('public'));
app.set('view engine', 'ejs');//ejs = Embedded JavaScript templates tipo php
app.set('views',__dirname+'/views');

//serve para mostrar mensagens ex.:req.flash('message', "Wrong password");
var flash = require('connect-flash');
app.use(flash());

/*Settings end*/

/*Server*/
var port = Number(process.env.PORT || 3000);
var server = app.listen(port, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)

});

function sendHTML(res, file, data){
	res.render(__dirname + "/public/views/"+ file, data);	
}


app.get('/', function (req, res) {
       sendHTML(res, "index");
})

