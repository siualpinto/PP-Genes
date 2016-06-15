module.exports = function(app, passport,http) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
     }));

    app.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    app.get('/general', function(req, res) {

        var options = {
              host: 'rest.kegg.jp',
              path: '/list/organism',
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


                    //console.log(data);          

                    var result = data.split("\n");
                    var one = JSON.parse(JSON.stringify(result[0].split("\t")));
    
                    console.log('one'+ one[3].split(";")[0]);

                     res.render('general.ejs', {
                        data : result
                });

            }); 


        }); 
    });

    app.get('/specific/:tipology', function(req, res) {

         var tipology = req.params.tipology;
         var trya = tipology.split(":");
         console.log(trya[1]);

            var options = {
              host: 'rest.kegg.jp',
              path: '/list/' + trya[1],
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

                    //console.log(data);          

                    var result = data.split("\n");
                    //console.log(json);
                     res.render('individual.ejs', {
                        data : result
                });

            }); 


            }); 
    });

    app.get('/pathway/:tipology', function(req, res) {

         var tipology = req.params.tipology;
         var trya = tipology.split(":");
         console.log(trya[1]);

            var options = {
              host: 'rest.kegg.jp',
              path: '/list/pathway/' + trya[1],
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

                    //console.log(data);          

                    var result = data.split("\n");
                    //console.log(json);
                     res.render('pathway.ejs', {
                        data : result
                });

            }); 


            }); 
    });

    app.get('/pathway/genes/:path', function(req, res){

        var xyz = req.params.path.split(':')[1];

        var options = {
          host: 'rest.kegg.jp',
          path: '/link/genes/'+xyz,
          headers: {
                'Content-Type': 'application/json'
            }
        };

         var request = http.get(options, function (response) {

            var data = '';

            response.on('data', function (chunk) {
                data += chunk;
            }); 

            response.on("end", function (err) {

                console.log('DATA: ' + data);

                if(err || data == null || data == ''){
                    res.render('index.ejs');
                    return;
                }


                //console.log(data);          

                var result = data.split("\n");

                 res.render('geneslist.ejs', {
                    data : result,
                    type : "pathway"
            });

        }); 


        }); 

    });

    app.get('/search/:params/:params2', function(req, res) {
            

        var params = req.params.params;
        var params2 = req.params.params2;
        console.log(params + params2);
        if (params == null || params2 == null){
            res.render('index.ejs');
            return;
        }


         var first = params.split(":");
         var second = params2.split(":");


        var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + first[1] + ":" + second[1],
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

                    var output = {}; 
                    if(one != null){
                    output.entry = one[1];
                    }
                    if(two != null){
                    output.name=two[1];
                    }
                    if(three != null){
                    output.definition=three[1];
                    }
                    if(four != null){
                    output.organism=four[1];
                    }
                    if(five != null){
                    output.position=five[1];
                    }
                    if(six != null){
                    output.motif=six[1];
                    }
                    if(seven != null){
                    output.dblinks=seven[1];
                    } 
                    if(eight != null){
                    output.aaseq=eight[1];
                    } 
                    if(nine != null){
                    output.ntseq=nine[1];
                    }

                  var options2 = {
                      host: 'rest.kegg.jp',
                      path: '/conv/ncbi-geneid/' + first[1] + ":" + second[1],
                      headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    var request2 = http.get(options2, function (response2) {

                        var data = '';

                        response2.setEncoding('utf8');

                        response2.on('data', function (chunk) {
                            data += chunk;
                        }); 

                        response2.on("end", function (err) {

                            if(err || data == null || data == ''){
                                res.render('search.ejs', {
                                gene : output // get the user out of session and pass to template
                            });
                            }

                             var id = data.match("ncbi-geneid(.*)");

                             console.log(id[1]);

                             var options3 = {
                              host:'www.ncbi.nlm.nih.gov',
                              path: '/entrez/eutils/esummary.fcgi?db=gene&id=1'
                            };

                        var request3 = http.get(options3, function (response3) {

                            var data = '';

                            response3.setEncoding('utf8');

                            response3.on('data', function (chunk) {
                                data += chunk;
                            }); 

                            response3.on("end", function (err) {

                                if(err || data == null || data == ''){
                                    res.render('search.ejs', {
                                    gene : output // get the user out of session and pass to template
                                });
                                }

                                 
                                 data = data.replace(/(\r\n|\n|\r)/gm,"");             

                                var one = data.match("<DbBuild>(.*)</DbBuild>");
                                var two = data.match("<Name>(.*)</Name>");
                                var three = data.match("<Description>(.*)</Description>");
                                var four = data.match("<Status>(.*)</Status>");
                                var five = data.match("<CurrentID>(.*)</CurrentID>");
                                var six = data.match("<Chromosome>(.*)</Chromosome>");
                                var seven = data.match("<GeneticSource>(.*)</GeneticSource>");
                                var eight = data.match("<MapLocation>(.*)</MapLocation>");
                                var nine = data.match("<OtherAliases>(.*)</OtherAliases>");
                                var ten = data.match("<OtherDesignations>(.*)</OtherDesignations>");
                                var eleven = data.match("<NomenclatureSymbol>(.*)</NomenclatureSymbol>");
                                var twelve = data.match("<NomenclatureName>(.*)</NomenclatureName>");
                                var thirteen = data.match("<NomenclatureStatus>(.*)</NomenclatureStatus>");
                                var fourteen = data.match("<int>(.*)</int>");
                                var fifteen = data.match("<ChrLoc>(.*)</ChrLoc>");
                                var sixteen = data.match("<ChrAccVer>(.*)</ChrAccVer>");
                                var seventeen = data.match("<ChrStart>(.*)</ChrStart>");
                                var eighteen = data.match("<ChrStop>(.*)</ChrStop>");
                                var nineteen = data.match("<ExonCount>(.*)</ExonCount>");
                                var twenty = data.match("<GeneWeight>(.*)</GeneWeight>");
                                var twentyone = data.match("<Summary>(.*)</Summary>");
                                var twentytwo = data.match("<ChrSort>(.*)</ChrSort>");
                                var twentythree = data.match("<ScientificName>(.*)</ScientificName>");
                                var twentyfour = data.match("<CommonName>(.*)</CommonName>");
                                var twentyfive = data.match("<TaxID>(.*)</TaxID>");

                                var output = {
                                entry:one[1],
                                name:two[1], 
                                definition:three[1],
                                orthology:four[1],
                                taxonomy:five[1],
                                lineage:six[1], 
                                organism:seven[1],
                                position:eight[1],
                                motif:nine[1],
                                dblinks:ten[1],
                                aaseq:eleven[1],
                                ntseq:twelve[1]
                                };
                    console.log(output);
                                 res.render('search.ejs', {

                                    gene : output // get the user out of session and pass to template
                             });

                                 

                            });

                        });
                             

                        });

                    }); 
                });
                         
            }); 

     });

    app.post('/search', function(req, res) {

            if(req.body.species != null || req.body.search != null){

            var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + req.body.species + ':' + req.body.search,
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
                    var three = data.match("DEFINITION(.*)AORTHOLOGY");
                    var four = data.match("AORTHOLOGY(.*)TAXONOMY");
                    var five = data.match("TAXONOMY(.*)LINEAGE");
                    var six = data.match("LINEAGE(.*)ORGANISM");
                    var seven = data.match("ORGANISM(.*)POSITION");
                    var eight = data.match("POSITION(.*)MOTIF");
                    var nine = data.match("MOTIF(.*)DBLINKS");
                    var ten = data.match("DBLINKS(.*)AASEQ");
                    var eleven = data.match("AASEQ(.*)NTSEQ");
                    var twelve = data.match("NTSEQ(.*)///");

                    var output = {
                    entry:one[1],
                    name:two[1], 
                    definition:three[1],
                    orthology:four[1],
                    taxonomy:five[1],
                    lineage:six[1], 
                    organism:seven[1],
                    position:eight[1],
                    motif:nine[1],
                    dblinks:ten[1],
                    aaseq:eleven[1],
                    ntseq:twelve[1]
                    };

                    console.log(output);

                    //console.log(json);
                     res.render('search.ejs', {

                    gene : output // get the user out of session and pass to template
                });

            }); 


            });

            }
            else{

                console.log(JSON.stringify(req.body.keyword));
                var xyz = req.body.keyword.replace(/ /g,"%20");
                var options = {
                  host: 'rest.kegg.jp',
                  path: '/find/genes/'+JSON.stringify(xyz),
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


                        //console.log(data);          

                        var result = data.split("\n");
                        var one = JSON.parse(JSON.stringify(result[0].split("\t")));

                         res.render('geneslist.ejs', {
                            data : result
                    });

                }); 


            }); 



            } 
    });

    app.get('/asearch', function(req, res) {

        var Specie = require('../app/models/species');

        Specie.find(function(err, species) {
          if (err){ 
            console.error(err);
            res.render('index.ejs');
            return;
        }
          else{
            var species = JSON.parse(JSON.stringify(species));
            res.render('asearch.ejs', {
                data : species
            });
            return; 
        }

        });
    });

    app.post('/asearch', function(req, res) {

            var id = req.body.genes; 
            var specie = req.body.species;

            if(id == null || specie == null){
                res.render('asearch.ejs');
                return;
            }

            var request = '';

            for(var i = 0; i < id.length;i++){

                if(i != id.length-1)
                    request += specie[i]+":"+id[i]+"+";
                else
                    request += specie[i]+":"+id[i];
            }

            console.log(request);

            var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + request,
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

                    var regex = /ENTRY/gi, result, Entryindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Entryindices.push(result.index);
                    }
                    var regex = /NAME/gi, result, Nameindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Nameindices.push(result.index);
                    }
                    var regex = /DEFINITION/gi, result, Definiindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Definiindices.push(result.index);
                    }
                    var regex = /ORGANISM/gi, result, Orgaindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Orgaindices.push(result.index);
                    }
                    var regex = /POSITION/gi, result, Posiindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Posiindices.push(result.index);
                    }
                    var regex = /MOTIF/gi, result, Motifindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Motifindices.push(result.index);
                    }
                    var regex = /DBLINKS/gi, result, DBlinksindices = [];
                    while ( (result = regex.exec(data)) ) {
                        DBlinksindices.push(result.index);
                    }
                    var regex = /AASEQ/gi, result, AASEQindices = [];
                    while ( (result = regex.exec(data)) ) {
                        AASEQindices.push(result.index);
                    }
                    var regex = /NTSEQ/gi, result, NTSEQindices = [];
                    while ( (result = regex.exec(data)) ) {
                        NTSEQindices.push(result.index);
                    };
                    var regex = /\/\/\//ig, result, Slashindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Slashindices.push(result.index);
                    }

                    var output = {
                        entry:'',
                        name:'',
                        definition:'',
                        organism:'',
                        position:'',
                        motif:'',
                        dblinks:'',
                        aaseq:'',
                        ntseq:''
                    };

                    for(var k=0; k<Entryindices.length;k++){
                        output.entry += data.substring(Entryindices[k]+5,Nameindices[k]-1)+";";
                        output.name += data.substring(Nameindices[k]+4,Definiindices[k]-1)+";";
                        output.definition += data.substring(Definiindices[k]+10,Orgaindices[k]-1)+";";
                        output.organism += data.substring(Orgaindices[k]+8,Posiindices[k]-1)+";";
                        output.position += data.substring(Posiindices[k]+8,Motifindices[k]-1)+";";
                        output.motif += data.substring(Motifindices[k]+5,DBlinksindices[k]-1)+";";
                        output.dblinks += data.substring(DBlinksindices[k]+7,AASEQindices[k]-1)+";";
                        output.aaseq += data.substring(AASEQindices[k]+5,NTSEQindices[k]-1)+";";                      
                        output.ntseq += data.substring(NTSEQindices[k]+5,Slashindices[k]-1)+";";
                    }

                     res.render('search.ejs', {
                        gene : output,
                        number : k
                    });

            }); 


            });
        });

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