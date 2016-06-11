module.exports = function(app, passport,http) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
     // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/search', function(req, res) {

            var options = {
              host: 'rest.kegg.jp',
              path: '/get/hsa:' + req.body.search,
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }

                    data = data.replace(/(\r\n|\n|\r)/gm,"");             

                    var one = data.match("ENTRY(.*)NAME");
                    var two = data.match("NAME(.*)DEFINITION");
                    var three = data.match("DEFINITION(.*)ORGANISM");
                    var four = data.match("ORGANISM(.*)POSITION");
                    var five = data.match("POSITION(.*)MOTIF");
                    var six = data.match("MOTIF(.*)DBLINKS");
                    var seven = data.match("DBLINKS(.*)AASEQ");
                    var eight = data.match("AASEQ(.*)NTSEQ");
                    var nine = data.match("NTSEQ(.*)///");

                    var output = {
                    entry:one[1],
                    name:two[1], 
                    definition:three[1], 
                    organism:four[1],
                    position:five[1],
                    motif:six[1],
                    dblinks:seven[1],
                    aaseq:eight[1],
                    ntseq:nine[1]
                    };

                    console.log(output);

                    //console.log(json);
                     res.render('search.ejs', {

                    gene : output // get the user out of session and pass to template
                });

        }); 


    }); 
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}