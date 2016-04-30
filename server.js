var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

var path = require('path');
var request = require('request');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


/*app.get('/api/teste', function(req, res) {

 
    request('http://rest.kegg.jp/info/genes', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Print the google web page.
     }
})
});*/

app.get('/', function (req, res) {
       res.render('teste.html');
})

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");